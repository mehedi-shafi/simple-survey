from rest_framework.routers import DefaultRouter

from survey.views import SurveyView

router = DefaultRouter()
router.register("", SurveyView)

urlpatterns = []

urlpatterns += router.urls
