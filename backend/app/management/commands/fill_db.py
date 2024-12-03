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


def add_faculties():
    Faculty.objects.create(
        name="ИУ",
        image="faculties/ИУ.png",
        description="Факультет информатики и систем управления готовит высококвалифицированные инженерные и научные кадры, специализирующиеся в тех областях научно-технических знаний, которые связаны с созданием и внедрением новейших информационных технологий, программно-аппаратных средств вычислительной техники, средств автоматизации приборов и систем управления, ориентации, стабилизации и навигации."
    ),
    Faculty.objects.create(
        name="ФН",
        image="faculties/ФН.png",
        description="Факультет «Фундаментальные науки» является выпускающим. Открыта подготовка высокопрофессиональных кадров в области прикладной математики, технической физики, компьютерных наук."
    ),
    Faculty.objects.create(
        name="МТ",
        image="faculties/МТ.png",
        description="В настоящее время 13 профилирующих кафедр факультета готовят инженеров, бакалавров и магистров. Развиваются наиболее совершенные принципы автоматизированной технологической подготовки современных производств (с применением роботов, обрабатывающих центров, систем автоматического управления производством)."
    ),
    Faculty.objects.create(
        name="СМ",
        image="faculties/СМ.png",
        description="Факультет выпускает специалистов для ракетно-космического и оборонного комплекса России. Выпускники внесли значительный вклад в создание ракет, космических аппаратов и военной техники."
    ),
    Faculty.objects.create(
        name="ИБМ",
        image="faculties/ИБМ.png",
        description="Факультет создан в МГТУ им. Баумана в 1993г. на базе старейшей в технических вузах России кафедры экономического профиля «Экономика и организация производства»."
    ),
    Faculty.objects.create(
        name="Э",
        image="faculties/Э.png",
        description="Факультет готовит профессиональные кадры по 14 специальностям. Девиз научных школ и выпускников факультета: «Впереди своего века!»."
    )

    client = Minio(settings.MINIO_ENDPOINT,
                   settings.MINIO_ACCESS_KEY,
                   settings.MINIO_SECRET_KEY,
                   secure=settings.MINIO_USE_HTTPS)

    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/ИУ.png', "app/static/images/faculties/ИУ.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/МТ.png', "app/static/images/faculties/МТ.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/СМ.png', "app/static/images/faculties/СМ.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/ФН.png', "app/static/images/faculties/ФН.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/Э.png', "app/static/images/faculties/Э.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/ИБМ.png', "app/static/images/faculties/ИБМ.png")
    client.fput_object(settings.MINIO_MEDIA_FILES_BUCKET, 'faculties/default.png', "app/static/images/faculties/default.png")


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        add_users()
        add_specializations()
        add_applicants()
        add_faculties()
