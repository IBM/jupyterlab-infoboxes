FROM python


RUN pip install jupyterlab~=3.0

COPY dist/jupyterlab_sn_infoboxes-3.0.0-py3-none-any.whl .
RUN pip install jupyterlab_sn_infoboxes-3.0.0-py3-none-any.whl
