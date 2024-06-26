// using IIFE
(() => {
  //----------------------------------------------------
  const navigation = {
    home: { title: "Home Page", url: "Home", section: "Home" },
    about: { title: "About Page", url: "About", section: "About" },
    posts: { title: "Member Page", url: "Member/Posts", section: "Posts" },
    search: {
      title: "Member Page",
      url: "Member/Search",
      section: "Search Posts",
    },
    users: { title: "Admin Page", url: "Admin/Users", section: "Manage Users" },
    content: {
      title: "Admin Page",
      url: "Admin/Content",
      section: "Manage Content",
    },
    register: {
      title: "Register Page",
      url: "Account/Register",
      section: "Register",
    },
    login: { title: "Login Page", url: "Account/Login", section: "Login" },
    admin: { title: "Admin Page", url: "Admin", section: "adminTab" },
  };
  const registerWarning = document.querySelector('#Register div[name="error"]');
  const loginWarning = document.querySelector('#Login div[name="error"]');
  let email = undefined;
  let activeEmail = undefined;
  //----------------------------------------------------
  /**
   * Utility functions
   */
  //----------------------------------------------------
  const getJSONData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };
  const postData = async (url = "", data = {}) => {
    console.log("url", url);
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  };
  const hide = (element) => (element.style.display = "none");
  const show = (element) => (element.style.display = "block");
  const setCopyrightYear = () => {
    document.querySelector("#footer kbd span").innerHTML =
      new Date().getFullYear();
  };
  //----------------------------------------------------
  /**
   * Client-side RESTful APIs
   *
   */
  //----------------------------------------------------
  const signup = async (event) => {
    // prevent refreshing the page
    event.preventDefault();
    email = document.querySelector('#Register input[name="email"]').value;
    let password = document.querySelector(
      '#Register input[name="password"]'
    ).value;
    let confirm = document.querySelector("#confirm").value;
    console.log(email, password, confirm);

    if (password == confirm) {
      const reply = await postData("/signup", { email, password });
      if (reply.error) {
        registerWarning.innerHTML = `${reply.error}`;
        show(registerWarning);
      } else if (reply.success) {
        console.log(reply, reply);
        window.history.pushState(
          navigation.posts,
          "",
          `/${navigation.posts.url}`
        );
        displaySection(navigation.posts);
        authorize(true, email);
        document.querySelector(
          "[data-authenticated] > span"
        ).innerHTML = `Welcome ${email}!`;
      }
    } else {
      registerWarning.innerHTML =
        "Passwords do not match. Re-enter your password";
      show(registerWarning);
    }
    activeEmail = email;
  };
  const signout = async (event) => {
    event.preventDefault();
    console.log(email);
    const reply = await postData("/signout", { email });
    if (reply.success) {
      console.log("inside signout");
      console.log(reply.success);
      console.log(reply, reply);
      window.history.pushState(navigation.home, "", `/${navigation.home.url}`);
      displaySection(navigation.home);
      authorize(false, email);
      email = undefined;
      activeEmail = undefined;
      clearTable();
    } else {
      console.log(reply);
    }
  };
  const signin = async (event) => {
    event.preventDefault();
    email = document.querySelector('#Login input[name="email"]').value;
    console.log(email);
    let password = document.querySelector(
      '#Login input[name="password"]'
    ).value;
    const reply = await postData("/signin", { email, password });
    if (reply.error) {
      loginWarning.innerHTML = `${reply.error}`;
      show(loginWarning);
    } else if (reply.success) {
      console.log(reply, reply);
      window.history.pushState(
        navigation.posts,
        "",
        `/${navigation.posts.url}`
      );
      displaySection(navigation.posts);
      authorize(true, email);
      document.querySelector(
        "[data-authenticated] > span"
      ).innerHTML = `Welcome ${email}!`;
    }
    activeEmail = email;
    getTransactionsAndBuildTable();
  };

  // ---------------------------------------------------------------------------------------------------
  // Buy Chips Functionality
  // ---------------------------------------------------------------------------------------------------

  document
    .getElementById("buyChipsForm")
    .addEventListener("submit", addTransaction);

  async function addTransaction(event) {
    event.preventDefault(); // Prevent the form from being submitted in the traditional way

    const email = activeEmail;
    const amount = document.getElementById("amount").value;

    const response = await fetch("/addTransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, amount: amount }),
    });

    const transaction = await response.json();

    // Handle the response here...
    if (transaction.error) {
      console.log(transaction.error);
    } else {
      console.log(transaction.success);
    }

    // Clear the form
    document.getElementById("amount").value = "";

    // Update the transaction history table
    getTransactionsAndBuildTable();
  }

  const clearTable = () => {
    const table = document.getElementById("transactionHistory");
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
  };

  async function getTransactionsAndBuildTable() {
    const email = activeEmail;

    const response = await fetch(`/getTransactions?email=${email}`);
    const transactions = await response.json();

    const table = document.getElementById("transactionHistory");
    // Clear the table
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }

    // Add a row for each transaction
    transactions.forEach((transaction) => {
      const row = table.insertRow(-1);
      const dateCell = row.insertCell(0);
      const amountCell = row.insertCell(1);

      dateCell.textContent = new Date(transaction.date).toLocaleString();
      amountCell.textContent = transaction.amount;
    });
  }

  // ---------------------------------------------------------------------------------------------------

  //----------------------------------------------------
  // Admin functions
  //----------------------------------------------------

  async function getAllUsers() {
    const response = await fetch("/getAllUsers");
    const users = await response.json();

    const table = document.getElementById("userManagement");

    // Clear the table
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }

    // Add a row for each user
    users.forEach((user) => {
      const row = table.insertRow(-1);
      const usernameCell = row.insertCell(0);
      const roleCell = row.insertCell(1);
      const sinceCell = row.insertCell(2);
      const actionCell = row.insertCell(3);
      const elevateCell = row.insertCell(4);

      usernameCell.textContent = user.email;
      roleCell.textContent = user.role;
      sinceCell.textContent = new Date(user.since).toLocaleString();

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        // Show a confirmation dialog
        if (confirm("Are you sure you want to delete this user?")) {
          const response = await fetch("/deleteUser/" + user._id, {
            method: "DELETE",
          });
          const result = await response.json();

          // Handle the response here...
          if (result.error) {
            console.log(result.error);
          } else {
            console.log(result.success);
            // Show a success message
            alert("User deleted successfully");
          }

          // Remove the row from the table
          row.remove();
        }
      });
      actionCell.appendChild(deleteButton);

      const elevateButton = document.createElement('button');
        elevateButton.textContent = 'Elevate to Admin';
        elevateButton.addEventListener('click', async () => {
            // Show a confirmation dialog
            if (confirm('Are you sure you want to elevate this user to admin?')) {
                const response = await fetch('/elevateUser/' + user._id, { method: 'PUT' });
                const result = await response.json();

                // Handle the response here...
                if (result.error) {
                    console.log(result.error);
                } else {
                    console.log(result.success);
                    // Show a success message
                    alert('User elevated to admin successfully');

                    // Update the user's role in the table
                    roleCell.textContent = 'admin';
                }
            }
        });
        elevateCell.appendChild(elevateButton);
    });
  }

async function getAllTransactions() {
    const response = await fetch("/getAllTransactions?email=" + activeEmail);
    const transactions = await response.json();

    const table = document.getElementById("transactionManagement");

    // Clear the table
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Add a row for each transaction
    transactions.forEach((transaction) => {
        const row = table.insertRow(-1);
        const userIdCell = row.insertCell(0);
        const amountCell = row.insertCell(1);
        const dateCell = row.insertCell(2);
        const actionCell = row.insertCell(3);

        userIdCell.textContent = transaction.user.email;
        amountCell.textContent = transaction.amount;
        dateCell.textContent = new Date(transaction.date).toLocaleString();

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            // Show a confirmation dialog
            if (confirm("Are you sure you want to delete this transaction?")) {
                const response = await fetch("/deleteTransaction/" + transaction._id, {
                    method: "DELETE",
                });
                const result = await response.json();

                // Handle the response here...
                if (result.error) {
                    console.log(result.error);
                } else {
                    console.log(result.success);
                    // Show a success message
                    alert("Transaction deleted successfully");
                }

                // Remove the row from the table
                row.remove();
            }
        });
        actionCell.appendChild(deleteButton);
    });
}

  //----------------------------------------------------
  // Functions to manage the navigation
  //----------------------------------------------------

  const setActivePage = (section) => {
    console.log(section);
    let menuItems = document.querySelectorAll("a[data-page]");
    menuItems.forEach((menuItem) => {
      if (section === menuItem.textContent) menuItem.classList.add("active");
      else menuItem.classList.remove("active");
    });
  };
  const displaySection = (state) => {
    console.log(state);
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      let name = section.getAttribute("id");
      if (name === state.section) {
        document.title = state.title;
        show(section);
        setActivePage(name);

        // If the section is the admin section, load the users and transactions
        if (name === "adminTab") {
          getAllUsers();
          getAllTransactions();
        }
      } else hide(section);
    });
  };
  const authorize = (isAuthenticated, username) => {
    const authenticated = document.querySelectorAll("[data-authenticated]");
    const nonAuthenticated = document.querySelector("[data-nonAuthenticated]");
    const adminAuthenticated = document.querySelectorAll(
      "[data-authenticated-admin]"
    ); // Select elements with the data-authenticated-admin attribute
    const adminTab = document.getElementById("adminTab"); // Get the admin tab

    if (isAuthenticated) {
      authenticated.forEach((element) => show(element));
      hide(nonAuthenticated);

      // If the username is "admin", show the admin tab and the elements with the data-authenticated-admin attribute
      if (username === "admin") {
        adminAuthenticated.forEach((element) => show(element));
      } else {
        hide(adminTab);
        adminAuthenticated.forEach((element) => hide(element));
      }
    } else {
      authenticated.forEach((element) => hide(element));
      show(nonAuthenticated);
      hide(adminTab);
      adminAuthenticated.forEach((element) => hide(element));
    }
  };

  // Handle forward/back buttons
  window.onpopstate = (event) => {
    // If a state has been provided, we have a "simulated" page
    // and we update the current page.
    if (event.state) {
      // Simulate the loading of the previous page
      displaySection(event.state);
    }
  };

  //--------------------------------------------------------------------------------------------------------------------------------

  document.addEventListener("DOMContentLoaded", () => {
    displaySection(navigation.home);
    window.history.replaceState(navigation.home, "", document.location.href);
    setCopyrightYear();
    document.onclick = (event) => {
      const page = event.target.getAttribute("data-page");
      if (page) {
        event.preventDefault();
        window.history.pushState(
          navigation[page],
          "",
          `/${navigation[page].url}`
        );
        displaySection(navigation[page]);
      }
    };
    authorize(false);
    const noticeDialog = document.querySelector("#noticeDialog");
    const errors = document.querySelectorAll('section div[name="error"]');
    errors.forEach((error) => hide(error));

    noticeDialog.showModal();
    document.querySelector("#noticeButton").onclick = (event) => {
      event.preventDefault();
      if (document.querySelector("#agree").checked) noticeDialog.close();
    };
    document.querySelector("#signup").onclick = signup;
    document.querySelector("#signout").onclick = signout;
    document.querySelector("#signin").onclick = signin;
  });
  //----------------------------------------------------
})();
