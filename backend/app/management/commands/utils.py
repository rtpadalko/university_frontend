import random
from datetime import datetime, timedelta
from django.utils import timezone


def random_date():
    now = datetime.now(tz=timezone.utc)
    return now + timedelta(random.uniform(-1, 0) * 100)


def random_timedelta(factor=100):
    return timedelta(random.uniform(0, 1) * factor)


def random_bool():
    return bool(random.getrandbits(1))


def format_date(raw, format="%d.%m.%Y"):
    return datetime.strptime(raw, format).date()


def random_phone():
    allowed_numbers = '1234567890'
    indx = '+7916'
    for i in range(6):
        indx += allowed_numbers[random.randint(0, len(allowed_numbers) - 1)]
    return indx

