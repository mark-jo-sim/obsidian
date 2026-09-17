---
type: tool
tags:
  - python
  - jupyter
  - jupyter_notebook
---
## Usage

Create Jupyter kernel from python interpreter:

```shell
uv pip install ipython ipykernel

ipython kernel install --user --name=myenv

python -m ipykernel install --user --name=myenv
```