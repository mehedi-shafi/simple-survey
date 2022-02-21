from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

admin.site.site_header = settings.ADMIN_SITE_HEADER

router = DefaultRouter()

SchemaView = get_schema_view(
    openapi.Info(
        title=settings.API_BROWSER_HEADER,
        default_version="v1",
        description="API Schema endpoint to generate swagger api documentation",
        terms_of_service="All rights reserved. © TallyCredit",
        contact=openapi.Contact(email="systems@surecash.net"),
        license=openapi.License(name="All rights reserved."),
    ),
    public=True,
    permission_classes=[AllowAny],
)

api_browser_urls = include("rest_framework.urls")


urlpatterns = [
    re_path(r"^api(?P<format>\.json|\.yaml)/$", SchemaView.without_ui(cache_timeout=0), name="schema-json"),
    path("api/", SchemaView.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("admin/", admin.site.urls),
    path("api/survey/", include("survey.urls")),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.authtoken")),
]

urlpatterns += router.urls
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
