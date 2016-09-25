About
-----

This is a prototype for a webpage which can generate acknowledgments for
facilities, data sets, and software.

I want to help!
---------------

Great! There are two places you can help: contributing entries, and helping
with the actual functionality.

### Contributing/fixing an entry

Each item that can be acknowledged is in a file in the ``entries`` folder of
the repository, in a format called YAML (just look at one of the existing files
to see what this looks like). You can edit the existing files to modify the
entries, and add new files to add new entries.

The syntax and required fields are:

    name: The Name Here
    category: codes
    tags:
    text: This is the acknowledgment
    latex: This is the LaTeX version (if needed)
    url: http://...
    notes:
    dependencies:
     - ...
     - ...

The ``dependencies`` field should contain a YAML list of other acknowledgments
that should be automatically included (not yet functional in the web interface,
but will work in future!).

You can also add a BibTex entry if needed:

    bibtex: >
     @ARTICLE{...,
        author = ...
        ...
     }

or AAS facility keywords (for observatories):

    facilities: \facility{Infrared Telescope Facility}

If you are not familiar with git, you should be able to add the files via the
GitHub interface. Simply navigate to the right directory, then click on the
following + symbol:

![add_file.png](static/add_file.png)

This will then automatically open a pull request. You can also just send me any
file by email (thomas.robitaille@gmail.com).

Note that after new entries are added, the ``database.json`` file needs to
be re-generated, but I will see to this, so you do not need to worry about it.

### Contributing to the interface

There are a number of issues open relating to the interface - you can find
these [here](https://github.com/astrofrog/acknowledgment-generator/issues). I
am still learning Javascript, so I am making slow progress, and any help is
highly welcome! Many of these issues are easy low-hanging fruit.

Contributors
------------

The following people have contributed to the concept/code:

- [Thomas Robitaille](https://github.com/astrofrog)
- [Cédric Foellmi](https://github.com/onekiloparsec)
- [Antonio Martin-Carrillo](https://github.com/kalgash82)
- [Niall Deacon](https://github.com/nialldeacon)
- [Stuart Lowe](https://github.com/slowe)

A full list of contributors, which includes individuals that have contributed entries, can be found [here](https://github.com/astrofrog/acknowledgment-generator/graphs/contributors).
