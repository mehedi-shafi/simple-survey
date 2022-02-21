from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from survey.serializers import SurveyReadSerializer, QuestionSerializer, QuestionOptionSerializer, SubmissionSerializer
from survey.models import Survey, Question, QuestionOption, Submission
from survey.services import SurveyWithAnswerService, EnumService


class QuestionView(viewsets.ModelViewSet):

    queryset = Question.objects.all()

    @action(methods=["GET", "POST"], detail=True)
    def options(self, request, pk=None, *args, **kwargs):
        if request.method == "GET":
            try:
                question = Question.objects.get(id=pk)
            except Question.DoesNotExist as dne:
                return Response(data={"errors": f"Question: {pk} does not exist"}, status=status.HTTP_404_NOT_FOUND)
            queryset = self.get_queryset().filter(question=pk)
            serializer = self.get_serializer(queryset, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            data = {
                **request.data,
                "question": pk,
            }
            serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_class(self):
        if self.action == "options":
            return QuestionOptionSerializer
        return QuestionSerializer

    def get_queryset(self):
        if self.action == "options":
            return QuestionOption.objects.all()
        return Question.objects.all()


class SurveyView(viewsets.ModelViewSet):

    queryset = Survey.objects.all()
    serializer_class = SurveyReadSerializer

    @action(methods=["GET"], detail=True)
    def submissions(self, request, pk=None, *args, **kwargs):
        try:
            survey = Survey.objects.get(id=pk)
        except Survey.DoesNotExist as dne:
            return Response(data={"errors": f"No survey with id {pk} exists"}, status=status.HTTP_404_NOT_FOUND)
        return Response(data=SurveyWithAnswerService().get_survey_with_answer(survey.id), status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=False)
    def enums(self, request, *args, **kwargs):
        return Response(data=EnumService.get_enums(), status=status.HTTP_200_OK)


class SubmissionView(mixins.ListModelMixin, viewsets.GenericViewSet):

    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    @action(methods=["GET"], detail=True, url_name="with-answers", url_path="with-answers")
    def with_answers(self, request, pk=None, *args, **kwargs):
        try:
            submission = Submission.objects.get(id=pk)
        except Submission.DoesNotExist as dne:
            return Response(data={"errors": f"No submission with id {pk} exists"}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            data=SurveyWithAnswerService().get_submission_with_answer(submission_id=pk), status=status.HTTP_200_OK
        )
