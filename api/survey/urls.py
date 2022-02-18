from rest_framework.routers import DefaultRouter

from survey.views import SurveyView, QuestionView

router = DefaultRouter()
router.register("", SurveyView)
router.register("question", QuestionView)

urlpatterns = []

urlpatterns += router.urls
