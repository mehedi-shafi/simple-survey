from django.db import connection

from survey.utils.db_utils import dictfetchall
from survey.enums import QuestionType, SubmissionStatus


class EnumService:
    @staticmethod
    def get_enums():
        response = {
            "question_types": {x[0]: x[1] for x in QuestionType.choices},
            "submission_statuses": {x[0]: x[1] for x in SubmissionStatus.choices},
        }
        return response


class SurveyWithAnswerService:

    survey_clause = None
    submission_clause = None
    user_clause = None

    def __init__(self):
        self.survey_clause = lambda survey_id: f"and sv.id = '{survey_id}'" if survey_id is not None else None
        self.submission_clause = (
            lambda submission_id: f"and s.id = '{submission_id}'" if submission_id is not None else None
        )

    def get_data_from_db(self, plug_in_query=None):
        plug_in_query = "" if plug_in_query is None else plug_in_query

        sql = f"""
            select
                s.id as submission_id,
                s.created_at as submission_time,
                sv.id as survey_id,
                sv.title as survey_title,
                sv.description as survey_description,
                au.id as user_id,
                au.username as username,
	            concat(au.first_name, ' ', au.last_name) as full_name,
                q.id as question_id,
                q.title as question,
                q.question_type as question_type,
                q.is_active as question_active,
                qo.id as question_option_id,
                qo.option as question_option,
                qo.action_id as question_action,
                a.answer as raw_answer,
                case 
                    when qo."option" is not null then qo."option" 
                    else a.answer
                end as answer
            from
                submission s
            join survey sv on
                s.survey_id = sv.id
                {plug_in_query}
            join auth_user au on 
                au.id = s.user_id
            join question q on 
                q.survey_id = sv.id
            left join answer a on
                a.question_id = q.id
            left join question_option qo on 
                qo.id = (case
                    when regexp_replace(a.answer, '[^0-9]+', '', 'g')= '' then null
                    else left(regexp_replace(a.answer, '[^0-9]+', '', 'g'), 7)
                end)::int
                and q.question_type not in ('TEXT', 'NUMERIC');
        """

        with connection.cursor() as cursor:
            cursor.execute(sql)
            return dictfetchall(cursor)

    def map_submission_data(self, db_data):
        data = {}
        if len(db_data) > 0:
            data = db_data[0]
        else:
            return {}
        response = {
            "id": data["survey_id"],
            "title": data["survey_title"],
            "description": data["survey_description"],
            "questions": [],
        }

        for data in db_data:
            response["questions"].append(
                {
                    "id": data["question_id"],
                    "title": data["question"],
                    "question_type": data["question_type"],
                    "answer": data["answer"],
                    "raw_answer": data["raw_answer"],
                    "options": [],
                    "is_active": data["question_active"],
                }
            )

        return response

    def map_survey_data(self, db_data):
        response = {}

        for data in db_data:
            survey_id = data["survey_id"]

            if survey_id not in response:
                response[survey_id] = {
                    "id": data["survey_id"],
                    "title": data["survey_title"],
                    "description": data["survey_description"],
                    "submissions": {},
                }

            username = data["username"]
            if username not in response[survey_id]["submissions"]:
                response[survey_id]["submissions"][username] = {
                    "id": data["user_id"],
                    "username": username,
                    "full_name": data["full_name"],
                    "questions": {},
                    "submission_id": data["submission_id"],
                    "submission_time": data["submission_time"],
                }

            question = data["question_id"]
            response[survey_id]["submissions"][username]["questions"][question] = {
                "id": question,
                "title": data["question"],
                "type": data["question_type"],
                "answer": data["answer"],
                "raw_answer": data["raw_answer"],
                "options": [],
                "is_active": data["question_active"],
            }

        return response

    def get_survey_with_answer(self, survey_id=None):

        plug_in_query = self.survey_clause(survey_id=survey_id)

        db_data = self.get_data_from_db(plug_in_query=plug_in_query)
        return self.map_survey_data(db_data)

    def get_submission_with_answer(self, submission_id=None):

        plug_in_query = self.submission_clause(submission_id=submission_id)

        db_data = self.get_data_from_db(plug_in_query=plug_in_query)

        return self.map_submission_data(db_data)
