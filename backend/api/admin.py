from django.contrib import admin
from .models import UploadedFile

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    # This makes the list view show useful columns instead of just "Object 1"
    list_display = ('file', 'uploaded_at') 
    
    # Optional: Add filters on the right side
    list_filter = ('uploaded_at',)