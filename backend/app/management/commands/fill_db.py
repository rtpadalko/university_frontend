from django.conf import settings
from django.core.management.base import BaseCommand
from minio import Minio

from .utils import *
from app.models import *


def add_users():
    User.objects.create_user("user", "user@user.com", "1234", first_name="user", last_name="user")
    User.objects.create_superuser("root", "root@root.com", "1234", first_name="root", last_name="root")

    for i in range(1, 10):
        User.objects.create_user(f"user{i}", f"user{i}@user.com", "1234", first_name=f"user{i}", last_name=f"user{i}")
        User.objects.create_superuser(f"root{i}", f"root{i}@root.com", "1234", first_name=f"user{i}", last_name=f"user{i}")


def add_specializations():
    Specialization.objects.create(
        name="ИУ4",
        description="Кафедра ИУ4 'Проектирование и технология производства электронной аппаратуры' осуществляет обучение по направлению, сочетающему в себе решение задач в областях конструирования, технологии производства и сквозной цифровизации промышленности. Основное внимание уделяется проведению сквозного (комплексного) схемотехнического, конструкторского и технологического проектирования электронной аппаратуры при активном использовании автоматизированных средств.",
        budget_place=66,
        budget_passing_score=239,
        paid_place=35,
        price=28654,
        image="1.png"
    )

    Specialization.objects.create(
        name="ИУ5",
        description="Системы обработки данных – это комплекс взаимодействующих методов и средств сбора и обработки электронной информации, необходимых для управления объектами с помощью электронно-вычислительных машин (ЭВМ) и других средств информационной техники.",
        budget_place=75,
        budget_passing_score=296,
        paid_place=81,
        price=329761,
        image="2.png"
    )

    Specialization.objects.create(
        name="ИУ8",
        description="Информационная безопасность — практика предотвращения несанкционированного доступа, использования, раскрытия, искажения, изменения, исследования, записи или уничтожения информации.",
        budget_place=59,
        budget_passing_score=281,
        paid_place=55,
        price=306347,
        image="3.png"
    )

    Specialization.objects.create(
        name="РК9",
        description="Кафедра занимается спектром технологий, которые являются составными частями концепции «Индустрия 4.0». Решаются задачи разработки интегрированных систем компьютерной автоматизации производственных процессов на разных уровнях, от станков с ЧПУ до интеллектуальных систем управления производством.",
        budget_place=48,
        budget_passing_score=260,
        paid_place=60,
        price=254823,
        image="4.png"
    )

    Specialization.objects.create(
        name="МТ4",
        description="Кафедра «Метрология и взаимозаменяемость», созданная в 1931 г., осуществляет подготовку бакалавров по профилю «Метрология и метрологическое обеспечение». Магистерская программа «Метрология и метрологическое обеспечение».",
        budget_place=66,
        budget_passing_score=239,
        paid_place=35,
        price=28654,
        image="5.png"
    )

    Specialization.objects.create(
        name="СМ1",
        description="Данное направление специализируется на управляемых баллистических ракетах на твердом топливе и развертываемых космических конструкциях. Ведущее место в учебной и научной работе кафедры занимают вопросы динамики и прочности конструкций. Только представь, какой высокой квалификации должны быть специалисты, отвечающие за такую ответственную задачу!",
        budget_place=60,
        budget_passing_score=195,
        paid_place=15,
        price=105632,
        image="6.png"
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    for i in range(1, 7):
        client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, f'{i}.png', f"app/static/images/{i}.png")

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'default.png', "app/static/images/default.png")


def add_applicants():
    users = User.objects.filter(is_staff=False)
    moderators = User.objects.filter(is_staff=True)
    specializations = Specialization.objects.all()

    for _ in range(30):
        status = random.randint(2, 5)
        owner = random.choice(users)
        add_applicant(status, specializations, owner, moderators)

    add_applicant(1, specializations, users[0], moderators)
    add_applicant(2, specializations, users[0], moderators)
    add_applicant(3, specializations, users[0], moderators)
    add_applicant(4, specializations, users[0], moderators)
    add_applicant(5, specializations, users[0], moderators)


def add_applicant(status, specializations, owner, moderators):
    applicant = Applicant.objects.create()
    applicant.status = status

    if status in [3, 4]:
        applicant.moderator = random.choice(moderators)
        applicant.date_complete = random_date()
        applicant.date_formation = applicant.date_complete - random_timedelta()
        applicant.date_created = applicant.date_formation - random_timedelta()
    else:
        applicant.date_formation = random_date()
        applicant.date_created = applicant.date_formation - random_timedelta()

    if status == 3:
        applicant.score = random.randint(200, 310)

    applicant.name = "Макаров Сергей Владимирович"
    applicant.birthday_date = 2004

    applicant.owner = owner

    for specialization in random.sample(list(specializations), 3):
        item = SpecializationApplicant(
            applicant=applicant,
            specialization=specialization,
            priority=random.randint(1, 10)
        )
        item.save()

    applicant.save()


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_specializations()
        add_applicants()
