from rest_framework import mixins, viewsets

from survey.serializers import SurveyReadSerializer
from survey.models import Survey


class SurveyView(mixins.ListModelMixin, viewsets.GenericViewSet):

    queryset = Survey.objects.all()

    def get_serializer_class(self):
        return SurveyReadSerializer
