from django.db import models
from django.utils.translation import gettext_lazy as _

class QuestionType(models.TextChoices):
    NUMERIC = 'NUMERIC', _('Numeric')
    TEXT = 'TEXT', _('Text')
    DROPDOWN = 'DROPDOWN', _('Dropdown')
    CHECKBOX = 'CHECKBOX', _('Checkbox')
    RADIO_BUTTON = 'RADIO_BUTTON', _('RadioButton')


class SubmissionStatus(models.TextChoices):
    STARTED = 'STARTED', _('Started')
    FINISHED = 'FINISHED', _('Finished')
    ABANDONED = 'ABANDONED', _('Abandoned')
