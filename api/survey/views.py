from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from survey.serializers import SurveyReadSerializer, QuestionSerializer, QuestionOptionSerializer
from survey.models import Survey, Question, QuestionOption


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


class SurveyView(mixins.ListModelMixin, viewsets.GenericViewSet):

    queryset = Survey.objects.all()
    serializer_class = SurveyReadSerializer
