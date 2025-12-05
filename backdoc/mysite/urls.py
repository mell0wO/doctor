from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # main API routes
    path('pat/', include('patients.urls')),
    path('finance/', include('finance.urls')),
    path('appointments/', include('appointments.urls')),

    # JWT Auth
    path('api/auth/', include('myapp.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
