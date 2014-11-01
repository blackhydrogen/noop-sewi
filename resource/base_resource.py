from abc import ABCMeta, abstractmethod

class abstractclassmethod(classmethod):
    """Abstract class method decorator

    Derived from Python 3
    """

    __isabstractmethod__ = True

    def __init__(self, callable):
        callable.__isabstractmethod__ = True
        super(abstractclassmethod, self).__init__(callable)

class BaseResource(object):
    """Abstract class definition for all Resources.

    A Resource can process data and provide and endpoint from which the data can be retrieved.
    """
    __metaclass__ = ABCMeta

    def __init__(self, resource_id):
        pass

    """Returns information (metadata) associated with the resource
    """
    @abstractmethod
    def get_info(self):
        pass

    """Returns all data content (binary or otherwise) associated with the resource
    """
    @abstractmethod
    def get_content(self):
        pass

    """Returns a string representation of the type of resource
    """
    @abstractmethod
    def get_type(self):
        pass

    """Returns whether an observation can be read with the resource
    """
    @abstractclassmethod
    def is_valid_observation(cls, observation):
        pass

    """Generates and returns a small image representation of the resource
    """
    @abstractmethod
    def generate_thumbnail(self):
        pass
