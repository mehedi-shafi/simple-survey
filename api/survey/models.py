from django.db import models
from django.contrib.auth import get_user_model

from survey.enums import QuestionType, SubmissionStatus
from survey.utils.unique_slug import unique_slugify

# Create your models here.
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Survey(BaseModel):
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=30, null=True, blank=True)
    description = models.TextField(max_length=1000, null=True, blank=True)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.DO_NOTHING)

    def save(self, *args, **kwargs):
        unique_slugify(self, self.title)
        super(Survey, self).save(*args, **kwargs)

    class Meta:
        db_table = "survey"


class Question(BaseModel):
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=400, null=True, blank=True)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, related_name="questions")
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.TEXT)
    is_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "question"


class QuestionOption(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    option = models.TextField(max_length=200)
    action = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    position = models.PositiveIntegerField()

    class Meta:
        db_table = "question_option"


class Submission(BaseModel):
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=SubmissionStatus.choices, default=SubmissionStatus.STARTED)

    class Meta:
        db_table = "submission"


class Answer(BaseModel):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=1000)

    class Meta:
        db_table = "answer"
