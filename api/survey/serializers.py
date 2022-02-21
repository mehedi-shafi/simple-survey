from rest_framework import serializers

from survey.models import Survey, Question, QuestionOption, Submission, Answer


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = "__all__"


class SurveyReadSerializer(serializers.ModelSerializer):

    questions = QuestionSerializer(
        read_only=True,
        many=True,
    )

    has_submission = serializers.SerializerMethodField()

    def get_has_submission(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        if user is not None:
            submissions = Submission.objects.filter(survey_id=obj.id, user_id=user.id, status="FINISHED")
            if submissions.exists():
                return True
        return False

    class Meta:
        model = Survey
        fields = "__all__"


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = "__all__"


class SubmissionSerializer(serializers.ModelSerializer):

    answers = AnswerSerializer(read_only=True, many=True)

    class Meta:
        model = Submission
        fields = "__all__"
