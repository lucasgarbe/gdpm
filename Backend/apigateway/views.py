# pages/views.py
from django.http import HttpResponse

from storage.models import Page


def homePageView(request):
    page = Page(title="Test Page23")
    page.save()

    return HttpResponse(page.title)
