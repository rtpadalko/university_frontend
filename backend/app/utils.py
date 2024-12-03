import random
from datetime import datetime, timedelta

from django.utils import timezone

from app.models import User

from app.redis import session_storage


def identity_user(request):
    session = get_session(request)

    if session is None or session not in session_storage:
        return None

    user_id = session_storage.get(session)
    user = User.objects.get(pk=user_id)

    return user


def get_session(request):
    # Пробуем авторизоваться по куке session_id
    if request.COOKIES.get("session_id"):
        return request.COOKIES.get("session_id")

    # Пробуем авторизоваться по заголовку Cookie
    if request.headers.get("Cookie"):
        return request.headers.get("Cookie").split(" ")[0]

    return None


def random_date():
    now = datetime.now(tz=timezone.utc)
    return now + timedelta(random.uniform(-1, 0) * 100)


def random_timedelta(factor=100):
    return timedelta(random.uniform(0, 1) * factor)


def random_bool():
    return bool(random.getrandbits(1))
