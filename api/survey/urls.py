from rest_framework.routers import DefaultRouter

from survey.views import SurveyView, QuestionView, SubmissionView, OptionView

router = DefaultRouter()
router.register("options", OptionView)
router.register("question", QuestionView)
router.register("submission", SubmissionView)
router.register("", SurveyView)

urlpatterns = []

urlpatterns += router.urls
