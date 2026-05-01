"""
Selenium WebDriver tests for VisualizeIT (https://visualize-it.tech/)

Flows covered:
  1. User can sign up with email and password
  2. User can log in with existing credentials
  3. New user is redirected to profile onboarding after login
  4. Profile form can be filled and submitted
  5. Simulation library loads and displays cards

Run with:
    python -m unittest tests/test_visualizeit.py -v
    # or
    python -m pytest tests/test_visualizeit.py -v

Dependencies:
    pip install selenium
    ChromeDriver must match your Chrome version and be on PATH.
    Alternatively: pip install webdriver-manager
    Then swap webdriver.Chrome() with:
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        cls.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
"""

import time
import unittest

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

BASE_URL = "https://visualize-it.tech"

# Credentials for a pre-existing account used in test_02_user_can_log_in.
# Replace with a real account that already has onboarding completed so the
# test can assert a clean /dashboard redirect.
EXISTING_EMAIL = "existing_user@example.com"
EXISTING_PASSWORD = "ExistingPass123!"

def _unique_email() -> str:
    """Return a unique email so each test run creates a fresh account."""
    return f"selenium_test_{int(time.time())}@example.com"

class VisualizeITTests(unittest.TestCase):

    # ------------------------------------------------------------------
    # Class-level setup: one browser for the whole suite
    # ------------------------------------------------------------------

    @classmethod
    def setUpClass(cls):
        options = Options()
        # Remove --headless to watch tests run live; add it back for CI.
        # options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1280,900")

        cls.driver = webdriver.Chrome(options=options)
        # Global implicit wait: Selenium will retry element lookups for up
        # to 3 seconds before raising NoSuchElementException.
        cls.driver.implicitly_wait(3)
        cls.driver.maximize_window()

        # Shared state: tests 3 & 4 use the same fresh account.
        cls.new_user_email = _unique_email()
        cls.new_user_password = "TestPass123!"

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _open_signin_modal(self):
        """Navigate to home and open the Sign In modal from the Navbar."""
        driver = self.driver
        driver.get(BASE_URL)
        # The Navbar renders a "Sign In" button that opens the modal.
        sign_in_btn = driver.find_element(
            By.XPATH, "//button[normalize-space(text())='Sign In']"
        )
        sign_in_btn.click()
        # Wait until the modal's email input is visible before returning.
        WebDriverWait(driver, 10).until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, "input[placeholder='you@example.com']")
            )
        )

    def _login(self, email: str, password: str):
        """Open the Sign In modal and submit credentials."""
        self._open_signin_modal()
        driver = self.driver
        driver.find_element(
            By.CSS_SELECTOR, "input[placeholder='you@example.com']"
        ).send_keys(email)
        driver.find_element(
            By.CSS_SELECTOR, "input[placeholder='Enter your password']"
        ).send_keys(password)
        # The modal's submit button also says "Sign In"; clicking the one
        # that is type=submit avoids accidentally clicking the Navbar button.
        driver.find_element(
            By.XPATH, "//button[@type='submit' and contains(text(),'Sign In')]"
        ).click()

    def _signup(self, name: str, email: str, password: str):
        """Fill and submit the /register form."""
        driver = self.driver
        driver.get(f"{BASE_URL}/register")
        driver.find_element(By.NAME, "name").send_keys(name)
        driver.find_element(By.NAME, "email").send_keys(email)
        driver.find_element(By.NAME, "password").send_keys(password)
        driver.find_element(By.NAME, "confirmPassword").send_keys(password)
        driver.find_element(
            By.XPATH, "//button[@type='submit']"
        ).click()

    # ------------------------------------------------------------------
    # Test 1 — Sign up
    # ------------------------------------------------------------------

    def test_01_user_can_sign_up(self):
        """
        A new visitor fills the /register form and gets redirected to
        the home page with ?registered=true, confirming the account was created.
        """
        email = _unique_email()
        self._signup("Selenium Tester", email, "TestPass123!")

        WebDriverWait(self.driver, 10).until(
            lambda d: "registered=true" in d.current_url
        )
        self.assertIn(
            "registered=true",
            self.driver.current_url,
            "Expected redirect to /?registered=true after successful signup",
        )

    # ------------------------------------------------------------------
    # Test 2 — Log in (pre-existing account)
    # ------------------------------------------------------------------

    def test_02_user_can_log_in(self):
        """
        A returning user opens the Sign In modal, enters valid credentials,
        and lands on /dashboard (or /profile if onboarding is incomplete).

        NOTE: Update EXISTING_EMAIL / EXISTING_PASSWORD at the top of this
        file with a real account that exists in the database.
        """
        self._login(EXISTING_EMAIL, EXISTING_PASSWORD)

        WebDriverWait(self.driver, 10).until(
            lambda d: "/dashboard" in d.current_url or "/profile" in d.current_url
        )
        current = self.driver.current_url
        self.assertTrue(
            "/dashboard" in current or "/profile" in current,
            f"Expected /dashboard or /profile after login, got: {current}",
        )

    # ------------------------------------------------------------------
    # Test 3 — New user is redirected to profile onboarding
    # ------------------------------------------------------------------

    def test_03_new_user_redirected_to_profile_onboarding(self):
        """
        After a brand-new user signs up and logs in for the first time,
        the OnboardingGate (in the root layout) detects that
        onboarding_completed is false and redirects them to /profile.
        """
        # Sign up a fresh account (shared with test 4).
        self._signup("New Tester", self.new_user_email, self.new_user_password)
        WebDriverWait(self.driver, 10).until(
            lambda d: "registered=true" in d.current_url
        )

        # Log in with the new account.
        self._login(self.new_user_email, self.new_user_password)

        WebDriverWait(self.driver, 10).until(
            lambda d: "/profile" in d.current_url or "/dashboard" in d.current_url
        )
        self.assertIn(
            "/profile",
            self.driver.current_url,
            "Expected new user to be redirected to /profile onboarding",
        )

    # ------------------------------------------------------------------
    # Test 4 — Profile form can be filled and submitted
    # ------------------------------------------------------------------

    def test_04_profile_form_can_be_filled_and_submitted(self):
        """
        While on /profile (continuing the session from test 3),
        the user fills all required fields and clicks 'Initialize Terminal'.
        On success they are redirected to /dashboard.
        """
        driver = self.driver

        # Ensure we are on the profile page (test 3 leaves us here).
        if "/profile" not in driver.current_url:
            driver.get(f"{BASE_URL}/profile")

        # Display name
        driver.find_element(By.NAME, "display_name").send_keys("Test User")

        # Branch dropdown
        Select(driver.find_element(By.NAME, "branch")).select_by_visible_text(
            "Information Technology"
        )

        # Year dropdown — selecting year 2 auto-suggests semester 3
        Select(driver.find_element(By.NAME, "year")).select_by_value("2")

        # Semester dropdown (auto-filled but we set it explicitly)
        Select(driver.find_element(By.NAME, "semester")).select_by_value("3")

        # Division dropdown
        Select(driver.find_element(By.NAME, "division")).select_by_visible_text("A")

        # Submit — button text is "Initialize Terminal →"
        driver.find_element(
            By.XPATH, "//button[contains(text(),'Initialize Terminal')]"
        ).click()

        WebDriverWait(driver, 15).until(
            lambda d: "/dashboard" in d.current_url
        )
        self.assertIn(
            "/dashboard",
            driver.current_url,
            "Expected redirect to /dashboard after profile form submission",
        )

    # ------------------------------------------------------------------
    # Test 5 — Simulation library loads and displays cards
    # ------------------------------------------------------------------

    def test_05_simulation_library_loads_and_displays_cards(self):
        """
        The /simulations page renders at least one simulation card,
        identifiable by an <h3> title and a 'Learn & Launch' link.
        No login is required to view the library.
        """
        self.driver.get(f"{BASE_URL}/simulations")

        # Wait for at least one card title to appear in the DOM.
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "h3"))
        )

        card_titles = self.driver.find_elements(By.CSS_SELECTOR, "h3")
        self.assertGreater(
            len(card_titles),
            0,
            "Expected at least one simulation card <h3> title on /simulations",
        )

        launch_links = self.driver.find_elements(
            By.XPATH, "//a[contains(text(),'Learn & Launch')]"
        )
        self.assertGreater(
            len(launch_links),
            0,
            "Expected at least one 'Learn & Launch' link on /simulations",
        )

if __name__ == "__main__":
    unittest.main(verbosity=2)
