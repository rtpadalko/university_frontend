from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, User
from django.db import models


class Specialization(models.Model):
    STATUS_CHOICES = (
        (1, 'Действует'),
        (2, 'Удалена'),
    )

    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(max_length=500, verbose_name="Описание",)
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    image = models.ImageField(verbose_name="Фото", blank=True, null=True)

    budget_place = models.IntegerField()
    budget_passing_score = models.IntegerField()
    paid_place = models.IntegerField()
    price = models.IntegerField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Специальность"
        verbose_name_plural = "Специальности"
        db_table = "specializations"
        ordering = ("pk",)


class Applicant(models.Model):
    STATUS_CHOICES = (
        (1, 'Введён'),
        (2, 'В работе'),
        (3, 'Завершен'),
        (4, 'Отклонен'),
        (5, 'Удален')
    )

    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    date_created = models.DateTimeField(verbose_name="Дата создания", blank=True, null=True)
    date_formation = models.DateTimeField(verbose_name="Дата формирования", blank=True, null=True)
    date_complete = models.DateTimeField(verbose_name="Дата завершения", blank=True, null=True)

    owner = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Создатель", related_name='owner', null=True)
    moderator = models.ForeignKey(User, on_delete=models.DO_NOTHING, verbose_name="Сотрудник", related_name='moderator', blank=True,  null=True)

    name = models.CharField(verbose_name="ФИО", blank=True, null=True)
    birthday_date = models.IntegerField(verbose_name="Дата", blank=True, null=True)
    score = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return "Абитуриент №" + str(self.pk)

    class Meta:
        verbose_name = "Абитуриент"
        verbose_name_plural = "Абитуриенты"
        db_table = "applicants"
        ordering = ('-date_formation', )


class SpecializationApplicant(models.Model):
    specialization = models.ForeignKey(Specialization, on_delete=models.DO_NOTHING, blank=True, null=True)
    applicant = models.ForeignKey(Applicant, on_delete=models.DO_NOTHING, blank=True, null=True)
    priority = models.IntegerField(verbose_name="Поле м-м", default=0)

    def __str__(self):
        return "м-м №" + str(self.pk)

    class Meta:
        verbose_name = "м-м"
        verbose_name_plural = "м-м"
        db_table = "specialization_applicant"
        ordering = ('pk', )
        constraints = [
            models.UniqueConstraint(fields=['specialization', 'applicant'], name="specialization_applicant_constraint")
        ]


class Faculty(models.Model):
    STATUS_CHOICES = (
        (1, 'Действует'),
        (2, 'Удалена'),
    )

    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(max_length=500, verbose_name="Описание",)
    status = models.IntegerField(choices=STATUS_CHOICES, default=1, verbose_name="Статус")
    image = models.ImageField(verbose_name="Фото", blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Факультет"
        verbose_name_plural = "Факультеты"
        db_table = "faculties"
        ordering = ("pk",)
