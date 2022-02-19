from rest_framework.routers import DefaultRouter

from survey.views import SurveyView, QuestionView, SubmissionView

router = DefaultRouter()
router.register("", SurveyView)
router.register("question", QuestionView)
router.register("submission", SubmissionView)

urlpatterns = []

urlpatterns += router.urls
