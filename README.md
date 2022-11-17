# Data Studio template

**This template is work in progress**

This is the template for a generic containerized NodeJS tool. This template can be used to generate new Github repositories from it.

Please note that is project has nothing to do with Javascript frontend tools/libs and NodeJS is also not used to
build some kind of webproject backend stack. We want to integrate NodeJS into a generic workflow runner to make tools available, 
scientists might be used to from frontend development.

## How generic?

Tools using this template can be run by the [toolbox-runner](https://github.com/hydrocode-de/tool-runner). 
That is only convenience, the tools implemented using this template are independent of any framework.

The main idea is to implement a common file structure inside container to load inputs and outputs of the 
tool. The template shares this structures with the [R template](https://github.com/vforwater(tool_template_r),
[Python template](https://github.com/vforwater(tool_template_python)
and [Octave template](https://github.com/vforwater(tool_template_octave), but can be mimiced in any container.

Each container needs at least the following structure:

```
/
|- in/
|  |- tool.json
|- out/
|  |- ...
|- src/
|  |- tool.yml
|  |- run.py
```

* `tool.json` are parameters. Whichever framework runs the container, this is how parameters are passed.
* `tool.yml` is the tool specification. It contains metadata about the scope of the tool, the number of endpoints (functions) and their parameters
* `run.js` is the tool itself, or a NodeJS script that handles the execution. It has to capture all outputs and either `print` them to console or create files in `/out`


## How to build the image?

You can build the image from within the root of this repo by
```
docker build -t tbr_node_tempate .
```

Use any tag you like. If you want to run and manage the container with [toolbox-runner](https://github.com/hydrocode-de/tool-runner)
they should be prefixed by `tbr_` to be recognized. 

Alternatively, the contained `.github/workflows/docker-image.yml` will build the image for you 
on new releases on Github. You need to change the target repository in the aforementioned yaml and the repository needs a 
[personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
in the repository secrets in order to run properly.

## How to run?

This template installs a few packages to parse the parameters in the `/in/tool.json`. This assumes that
the files are not renamed and not moved and there is actually only one tool in the container. For any other case, the environment variables `PARAM_FILE` can be used to specify a new location for the `tool.json` and `TOOL_RUN` can be used to specify the tool to be executed.
The `run.js` has to take care of that.

To invoke the docker container directly run something similar to:
```
docker run --rm -it -v /path/to/local/in:/in -v /path/to/local/out:/out -e TOOL_RUN=foobar tbr_node_template
```

Then, the output will be in your local out and based on your local input folder. Stdout and Stderr are also connected to the host.

With the toolbox runner, this is simplyfied:

```python
from toolbox_runner import list_tools
tools = list_tools() # dict with tool names as keys

foobar = tools.get('foobar')  # it has to be present there...
foobar.run(result_path='./', foo_int=1337, foo_string="Please change me")
```
The example above will create a temporary file structure to be mounted into the container and then create a `.tar.gz` on termination of all 
inputs, outputs, specifications and some metadata, including the image sha256 used to create the output in the current working directory.

## What about real tools, no foobar?

Yeah. 

1. change the `tool.yml` to describe your actual tool
2. add any `npm install` or `apt-get install` needed to the dockerfile
3. add additional source code to `/src`
4. change the `run.js` to consume parameters and data from `/in` and useful output in `out`
5. build, run, rock!

