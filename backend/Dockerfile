FROM python:3.9.18-alpine3.19

WORKDIR /code

RUN apk add make automake gcc g++ subversion python3-dev

RUN pip install --no-cache-dir --upgrade python-dateutil

COPY ./requirements.txt /code/requirements.txt

RUN pip install -r /code/requirements.txt

COPY . /code/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]