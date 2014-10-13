"""Test helper module
This module contains methods to assist in test cases involving the various
types of resources.

@author: Muhammad Fazli Bin Rosli
"""
from datetime import datetime
from django.contrib.auth.models import User
from mds.core.models import Procedure, Observer, Device, Subject, Encounter, Location, Concept

def create_test_encounter():
    """Generates the necessary data needed for a test Encounter.

    @rtype: str
    @return: The UUID of the test Encounter.
    """
    test_user = User.objects.create_user('testuser', 'user@test.com', 'password')

    test_location = Location.objects.create(name = 'Test Location')

    test_concept = Concept.objects.create(
        name = 'TEST ENCOUNTER',
        display_name = 'Test Encounter',
        description = 'Test Encounter',
    )

    test_procedure = Procedure.objects.create(
        title = 'Test Procedure',
        author = 'Test Author',
        description = 'Test procedure for unit tests only',
    )

    test_observer = Observer.objects.create(user = test_user)

    test_device = Device.objects.create(name='TestDevice')

    test_subject = Subject.objects.create(
        given_name = 'Test',
        family_name = 'Subject',
        dob = datetime.today(),
        gender = 'M',
        location = test_location
    )

    test_encounter = Encounter.objects.create(
        procedure = test_procedure,
        observer = test_observer,
        device = test_device,
        subject = test_subject,
        concept = test_concept
    )

    return test_encounter

def delete_test_encounter(test_encounter):
    """Removes the test encounter, and all associated data.

    @type encounter_id: str
    @param encounter_id: The UUID of the Encounter.
    """
    #test_encounter = Encounter.objects.get(uuid = encounter_id)
    test_subject = test_encounter.subject
    test_device = test_encounter.device
    test_observer = test_encounter.observer
    test_procedure = test_encounter.procedure
    test_user = test_observer.user
    test_location = test_subject.location
    test_concept = test_encounter.concept

    test_encounter.delete()
    test_subject.delete()
    test_device.delete()
    test_observer.delete()
    test_procedure.delete()
    test_user.delete()
