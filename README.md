About
-----

This is a very basic prototype for a webpage which can generate 
acknowledgments for facilities, data sets, and software. This is still 
at the prototyping phase so should not be expected to be functional (yet).

Contributing entries
--------------------

To contribute an entry, add a YAML file to the ``entries`` folder, in one of
the available sub-folders. The syntax and required fields are:

    name: The Name Here
    category: codes
    tags:
    text: This is the acknowledgment
    url: http://...
    dependencies:
     - ...
     - ...
    bibtex: >
     @ARTICLE{...,
        author = ...
        ...
     }

The only required fields are ``name``, ``category`` (which should match the containing folder), and ``text``. So in reality you can write a file that looks like:

    name: The Name Here
    category: codes
    tags:
    text: This is the acknowledgment
    url:
    dependencies:
    bibtex:

The ``dependencies`` field should contain a YAML list of other acknowledgments that should be automatically included (not yet functional in the web interface).

The ``bibtex`` entry should contain the BibTeX code required for any citations in the acknowledgment (not yet functional in the web interface). You should indent the whole BibTeX entry by one space.

You can either open a pull request to add files (if you are familiar with the process) or just send them to me by email (thomas.robitaille@gmail.com).

Contributors
------------

- Thomas Robitaille
- Niall Deacon
