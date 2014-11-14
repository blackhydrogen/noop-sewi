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

    def test_drag_and_drop_full(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
       
        closeButton = self.browser.find_by_css('.close-button')[0]
        closeButton.click()
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-drop-area-full')[0]
        draggable.drag_and_drop(target)
        panelFull = self.browser.find_by_css('.panel-full');
        self.assertNotEqual(len(panelFull), 0, 'panel full does not exist');
    
    def test_drag_and_drop_left_right(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)
        panelRight = self.browser.find_by_css('.panel-right')
        panelLeft = self.browser.find_by_css('.panel-left')
        self.assertNotEqual(len(panelRight), 0, "right panel does not exist");
        self.assertNotEqual(len(panelLeft), 0, "left panel does not exist");


    def test_drag_and_drop_top_bottom(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)
        panelTop = self.browser.find_by_css('.panel-top')
        panelBottom = self.browser.find_by_css('.panel-bottom')
        self.assertNotEqual(len(panelTop), 0, "top panel does not exist");
        self.assertNotEqual(len(panelBottom), 0, "bottom panel does not exist");


    def test_drag_and_drop_Left_1_right_2(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-right').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)

        panelLeft = self.browser.find_by_css('.panel-left')
        panelTopRight = self.browser.find_by_css('.panel-top-right')
        panelBottomRight = self.browser.find_by_css('.panel-bottom-right')
        self.assertNotEqual(len(panelLeft), 0, "left panel does not exist")
        self.assertNotEqual(len(panelTopRight), 0, "top right panel does not exist")
        self.assertNotEqual(len(panelBottomRight), 0, "bottom right panel does not exist")

    def test_drag_and_drop_left_2_right_1(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-left')[0]
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-left').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)

        panelRight = self.browser.find_by_css('.panel-right')
        panelTopLeft = self.browser.find_by_css('.panel-top-left')
        panelBottomLeft = self.browser.find_by_css('.panel-bottom-left')
        self.assertNotEqual(len(panelRight), 0, "right panel does not exist")
        self.assertNotEqual(len(panelTopLeft), 0, "top left panel does not exist")
        self.assertNotEqual(len(panelBottomLeft), 0, "bottom left panel does not exist")


    def test_drag_and_drop_top_1_bottom_2(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-top')[0]
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-bottom').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)

        panelTop = self.browser.find_by_css('.panel-top')
        panelBottomRight = self.browser.find_by_css('.panel-bottom-right')
        panelBottomLeft = self.browser.find_by_css('.panel-bottom-left')
        self.assertNotEqual(len(panelTop), 0, "top panel does not exist")
        self.assertNotEqual(len(panelBottomRight), 0, "bottom right panel does not exist")
        self.assertNotEqual(len(panelBottomLeft), 0, "bottom left panel does not exist")

    def test_drag_and_drop_top_2_bottom_1(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)
        
        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-bottom')[0]
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-top').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)

        panelBottom = self.browser.find_by_css('.panel-bottom')
        panelTopRight = self.browser.find_by_css('.panel-top-right')
        panelTopLeft = self.browser.find_by_css('.panel-top-left')
        self.assertNotEqual(len(panelBottom), 0, "bottom panel does not exist")
        self.assertNotEqual(len(panelTopRight), 0, "top right panel does not exist")
        self.assertNotEqual(len(panelTopLeft), 0, "top left panel does not exist")

    def test_drag_and_drop_4_panels_1(self):
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

    def test_drag_and_drop_4_panels_2(self):
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

    def test_close_resources_1(self):        
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)

        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-top')[0]        
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-bottom').find_by_css('.panel-drop-area-left')[0]
        draggable.drag_and_drop(target)
        
        target = self.browser.find_by_css('.panel-top').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)

        panelTopRight = self.browser.find_by_css('.panel-top-right')[0]
        panelTopRight.click()
        buttonClose = self.browser.find_by_css('.panel-top-right').find_by_css('.close-button')[0]
        buttonClose.click()
        sleep(1)

        panelBottomLeft = self.browser.find_by_css('.panel-bottom-left')[0]
        panelBottomLeft.click()
        buttonClose = self.browser.find_by_css('.panel-bottom-left').find_by_css('.close-button')[0]
        buttonClose.click()
        sleep(1)

        panelTop = self.browser.find_by_css('.panel-top')
        panelBottom = self.browser.find_by_css('.panel-bottom');
        self.assertNotEqual(len(panelTop), 0, "top panel doesn't exist")
        self.assertNotEqual(len(panelBottom), 0, "bottom panel doesn't exist")

    def test_close_resources_2(self):
        self.browser.visit('%s/sewi/encounter/77d09b28-abed-4a6a-b48b-6b368bd2fdb3' % self.live_server_url)
        sleep(3)
        
        resource = self.browser.find_by_css('.resource')[0]
        resource.double_click()
        sleep(3)

        draggable = self.browser.find_by_css('.ui-draggable')[0]
        target = self.browser.find_by_css('.panel-full').find_by_css('.panel-drop-area-top')[0]        
        draggable.drag_and_drop(target)

        target = self.browser.find_by_css('.panel-bottom').find_by_css('.panel-drop-area-left')[0]
        draggable.drag_and_drop(target)
        
        target = self.browser.find_by_css('.panel-top').find_by_css('.panel-drop-area-right')[0]
        draggable.drag_and_drop(target)

        panelTopRight = self.browser.find_by_css('.panel-top-right')[0]
        panelTopRight.click()
        buttonClose = self.browser.find_by_css('.panel-top-right').find_by_css('.close-button')[0]
        buttonClose.click()
        sleep(1)
        
        panelTop = self.browser.find_by_css('.panel-top')[0]
        panelTop.click()
        buttonClose = self.browser.find_by_css('.panel-top').find_by_css('.close-button')[0]
        buttonClose.click()
        sleep(1)

        panelLeft = self.browser.find_by_css('.panel-left')
        panelRight = self.browser.find_by_css('.panel-right')
        self.assertNotEqual(len(panelLeft), 0, "panel left doesn't exist");
        self.assertNotEqual(len(panelRight), 0, "panel right doesn't exist");

