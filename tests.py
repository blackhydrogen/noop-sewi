from django.test import TestCase, LiveServerTestCase
from splinter import Browser
from time import sleep

class TabUITest(LiveServerTestCase):
    fixtures = ['test.json'];

    @classmethod
    def setUpClass(self):
        super(TabUITest, self).setUpClass()
        self.browser = Browser('firefox')

    @classmethod
    def tearDownClass(self):
        super(TabUITest, self).tearDownClass()
        self.browser.quit()

    def test_drag_and_drop1(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)

        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)
        panelRight = self.browser.find_by_css('.panel-right')
        self.assertNotEqual(len(panelRight), 0, "right panel does not exist");

        target = self.browser.find_by_css('.panel-right').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)
        topRightPanel = self.browser.find_by_css('.panel-top-right')
        self.assertNotEqual(len(topRightPanel), 0, "top right panel does not exist")
        
        target = self.browser.find_by_css('.panel-left').find_by_css('.panel-drop-area-bottom')[0]
        draggable.drag_and_drop(target)
        bottomLeftPanel = self.browser.find_by_css('.panel-bottom-left')
        self.assertNotEqual(len(bottomLeftPanel), 0, "bottom left panel does not exist")

    def test_drag_and_drop2(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)

        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)
        topPanel = self.browser.find_by_css('.panel-top')
        bottomPanel = self.browser.find_by_css('.panel-bottom')
        self.assertNotEqual(len(topPanel), 0, "top panel does not exist");
        self.assertNotEqual(len(bottomPanel), 0, "bottom panel does not exist");

        target = self.browser.find_by_css('.panel-bottom').find_by_css('.panel-drop-area-left')[0]
        draggable.drag_and_drop(target)
        bottomRightPanel = self.browser.find_by_css('.panel-bottom-right')
        bottomLeftPanel = self.browser.find_by_css('.panel-bottom-left')
        self.assertNotEqual(len(bottomRightPanel), 0, "bottom right panel does not exist")
        self.assertNotEqual(len(bottomLeftPanel), 0, "bottom left panel does not exist")
        
        target = self.browser.find_by_css('.panel-bottom-left').find_by_css('.panel-drop-area-bottom')[0]
        draggable.drag_and_drop(target)
        topLeftPanel = self.browser.find_by_css('.panel-top-left')
        self.assertNotEqual(len(topLeftPanel), 0, "top left panel does not exist")

    def test_open_close_tab(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)

        button = self.browser.find_by_css('.add-tab-button')[0]
        button.click()
        tabs = self.browser.find_by_css('.tab-pane')
        self.assertEqual(len(tabs), 2, "Number of tabs doesn't match")

        button.click()
        tabs = self.browser.find_by_css('.tab-pane')
        self.assertEqual(len(tabs), 3, "Number of tabs doesn't match")


        button.click()
        button.click()
        tabs = self.browser.find_by_css('.tab-pane')
        self.assertEqual(len(tabs), 5, "Number of tabs doesn't match")

        button = self.browser.find_by_css('.glyphicon-remove')
        button[0].click()
        tabs = self.browser.find_by_css('.tab-pane')
        self.assertEqual(len(tabs), 4, "Number of tabs doesn't match")

        button[2].click()
        button[1].click()
        tabs = self.browser.find_by_css('.tab-pane')
        self.assertEqual(len(tabs), 2, "Number of tabs doesn't match")



