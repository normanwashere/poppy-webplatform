<script>
    import { onMount } from 'svelte';
    import * as lucide from 'lucide';
    import { Calendar } from '@fullcalendar/core';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import timeGridPlugin from '@fullcalendar/timegrid';

    // --- TEMPLATES FOR EACH PAGE  ---
    let pageTemplates = {
        login: `
            <div class="w-full max-w-md mx-auto">
                <header class="text-center mb-8"><div class="inline-block bg-white p-4 rounded-full shadow-md mb-4 clay-card"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2Z" fill="#831843"/><path d="M12 14C9.33333 14 4 15.3333 4 18V22H20V18C20 15.3333 14.6667 14 12 14Z" fill="#d97706"/><path d="M12 2C13.5 2 15 3 15 5C15 7 12 9 12 9C12 9 9 7 9 5C9 3 10.5 2 12 2Z" fill="#fdf8f6"/></svg></div><h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">Welcome Back</h1><p class="text-gray-500 mt-2">Log in to access your dashboard.</p></header>
                <form id="login-form" class="clay-card p-6 sm:p-8 space-y-6">
                    <div><label for="login-email" class="block text-sm font-medium mb-2">Email Address</label><input type="email" id="login-email" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div><label for="login-password" class="block text-sm font-medium mb-2">Password</label><input type="password" id="login-password" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div class="pt-2"><button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Login</button></div>
                </form>
                <div class="text-center mt-6"><p class="text-sm">Don't have an account? <a href="#" id="show-signup" class="font-semibold hover:underline" style="color: #831843;">Sign Up</a></p></div>
            </div>`,
        signup: `
            <div class="w-full max-w-md mx-auto">
                <header class="text-center mb-8"><h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">Create Your Account</h1><p class="text-gray-500 mt-2">Join the Poppy Platform.</p></header>
                <form id="signup-form" class="clay-card p-6 sm:p-8 space-y-6">
                    <div><label for="fullname" class="block text-sm font-medium mb-2">Full Name</label><input type="text" id="fullname" name="fullname" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div><label for="email" class="block text-sm font-medium mb-2">Email Address</label><input type="email" id="email" name="email" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div><label for="password" class="block text-sm font-medium mb-2">Password</label><input type="password" id="password" name="password" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div class="pt-2"><button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Create Account</button></div>
                </form>
                <div class="text-center mt-6"><p class="text-sm">Already have an account? <a href="#" id="show-login" class="font-semibold hover:underline" style="color: #831843;">Login</a></p></div>
            </div>`,
        dashboard: `<div class="w-full max-w-7xl mx-auto"><header class="text-center mb-8"><h1 id="dashboard-title" class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700"></h1><p id="dashboard-subtitle" class="text-gray-500 mt-2"></p></header><div id="dashboard-container"></div></div>`,
        scheduler: `<div class="w-full max-w-7xl mx-auto"><header class="text-center mb-8"><h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">Live Session Scheduler</h1><p class="text-gray-500 mt-2">Book your upcoming live sessions.</p></header><div class="clay-card p-2 sm:p-6 mb-8"><div id='calendar'></div></div></div>`,
        userManagement: `
            <div class="w-full max-w-4xl mx-auto">
                <header class="text-center mb-8"><h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">User Management</h1><p class="text-gray-500 mt-2">Approve new seller accounts and manage existing users.</p></header>
                <div id="user-list-container" class="clay-card overflow-hidden"></div>
            </div>`,
        bonusRules: `
            <div class="w-full max-w-5xl mx-auto">
                <header class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div class="text-center sm:text-left">
                       <h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">Bonus Rules</h1>
                       <p class="text-gray-500 mt-2">Create and manage performance-based bonus schemes.</p>
                    </div>
                    <button id="create-new-rule-btn" class="clay-button clay-button-primary w-full sm:w-auto px-6 py-4 text-lg">Create New Rule</button>
                </header>
                <div id="bonus-rules-list" class="space-y-4"></div>
            </div>`,
        userProfile: `
            <div class="w-full max-w-2xl mx-auto">
                <header class="text-center mb-8"><h1 class="font-playfair text-4xl sm:text-5xl font-bold text-gray-700">Profile</h1><p class="text-gray-500 mt-2">Update your personal information and password.</p></header>
                <form id="profile-info-form" class="clay-card p-6 sm:p-8 space-y-8 mb-8">
                     <fieldset><legend class="font-playfair text-2xl font-bold mb-4">Contact Information</legend>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div><label for="profile-gcash" class="block text-sm font-medium mb-2">GCash Number</label><input type="text" id="profile-gcash" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div>
                            <div><label for="profile-contact" class="block text-sm font-medium mb-2">Contact Number</label><input type="text" id="profile-contact" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div>
                            <div class="sm:col-span-2"><label for="profile-emergency" class="block text-sm font-medium mb-2">Emergency Contact</label><input type="text" id="profile-emergency" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div>
                        </div>
                     </fieldset>
                     <div class="pt-2"><button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Save Information</button></div>
                </form>
                 <form id="password-change-form" class="clay-card p-6 sm:p-8 space-y-8">
                     <fieldset><legend class="font-playfair text-2xl font-bold mb-4">Change Password</legend>
                        <div class="space-y-6">
                            <div><label for="profile-new-password" class="block text-sm font-medium mb-2">New Password</label><input type="password" id="profile-new-password" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div>
                            <div><label for="profile-confirm-password" class="block text-sm font-medium mb-2">Confirm New Password</label><input type="password" id="profile-confirm-password" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div>
                        </div>
                     </fieldset>
                     <div class="pt-2"><button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Change Password</button></div>
                </form>
            </div>`
    };

    // --- Global State & App Variables ---
    let appContainer;
    let mainHeader;
    let navLinksContainer;

    let calendarInstance = null;
    let mockUsers = [
        { id: 0, name: 'Admin', email: 'admin@poppy.com', password: 'admin', role: 'admin', status: 'approved', gcash: '', contact: '', emergencyContact: '' },
        { id: 1, name: 'Seller A', email: 'seller.a@example.com', password: 'password', role: 'seller', status: 'approved', gcash: '09171234567', contact: '09171234567', emergencyContact: '09177654321' },
        { id: 2, name: 'Seller B', email: 'seller.b@example.com', password: 'password', role: 'seller', status: 'approved', gcash: '09181234567', contact: '09181234567', emergencyContact: '09187654321' },
        { id: 3, name: 'Seller C', email: 'seller.c@example.com', password: 'password', role: 'seller', status: 'approved', gcash: '', contact: '', emergencyContact: '' },
        { id: 4, name: 'Jane Doe', email: 'jane.d@example.com', password: 'password', role: 'seller', status: 'pending', gcash: '', contact: '', emergencyContact: '' },
    ];
    let mockBonusRules = [
        { id: 1, name: 'Monthly Excellence Bonus', description: 'For sellers who meet all monthly targets.', startDate: '2025-06-01', endDate: '2025-06-30', liveHours: 40, brandedItems: 60, freeSize: 100, timeFrame: 'monthly', amount: 500.00 },
        { id: 2, name: 'Weekly Warrior', description: 'Hit weekly sales goals.', startDate: '2025-06-16', endDate: '2025-06-22', liveHours: 10, brandedItems: 20, freeSize: 30, timeFrame: 'weekly', amount: 150.00 }
    ];

    let state = {
        isLoggedIn: false,
        userRole: null,
        userId: null,
        currentPage: 'login',
        LOGGED_IN_SELLER: null,
        ruleToDelete: null,
    };

    // --- Global Helper Functions ---
    const showAlert = (title, message, onOk) => {
        document.getElementById('alert-title').textContent = title;
        document.getElementById('alert-message').textContent = message;
        const modal = document.getElementById('alert-modal');
        modal.classList.remove('hidden');
        const okBtn = document.getElementById('alert-ok-btn');
        okBtn.onclick = () => {
            modal.classList.add('hidden');
            if (onOk) onOk();
        };
    };
    const parseDateAsUTC = (dateString) => {
        if (!dateString) return null;
        const d = new Date(dateString.trim());
        if (isNaN(d.getTime())) return null;
        return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    };
    const getWeekRange = (weekType) => {
        const today = new Date();
        const dayOfWeek = today.getUTCDay();
        let endOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const daysUntilTuesday = (2 - dayOfWeek + 7) % 7;
        endOfWeek.setUTCDate(endOfWeek.getUTCDate() + daysUntilTuesday);
        if (weekType === 'last') endOfWeek.setUTCDate(endOfWeek.getUTCDate() - 7);
        let startOfWeek = new Date(endOfWeek);
        startOfWeek.setUTCDate(startOfWeek.getUTCDate() - 6);
        startOfWeek.setUTCHours(0, 0, 0, 0);
        endOfWeek.setUTCHours(23, 59, 59, 999);
        return { start: startOfWeek, end: endOfWeek };
    };
    const getMonthRange = (monthType) => {
        const today = new Date();
        let year = today.getUTCFullYear();
        let month = today.getUTCMonth();
        if (monthType === 'last') {
            month -= 1;
            if (month < 0) { month = 11; year -= 1; }
        }
        const start = new Date(Date.UTC(year, month, 1));
        const end = new Date(Date.UTC(year, month + 1, 0));
        end.setUTCHours(23,59,59,999);
        return { start, end };
    };

    // --- Page Setup & Rendering ---
    function showPage(pageName) {
        if (!pageTemplates[pageName]) return;
        appContainer.innerHTML = pageTemplates[pageName];
        state.currentPage = pageName;

        switch (pageName) {
            case 'login': setupLoginPage(); break;
            case 'signup': setupSignupPage(); break;
            case 'dashboard': setupDashboardPage(); break;
            case 'scheduler': setupSchedulerPage(); break;
            case 'userManagement': setupUserManagementPage(); break;
            case 'bonusRules': setupBonusRulesPage(); break;
            case 'userProfile': setupUserProfilePage(); break;
        }
        lucide.createIcons();
    }

    function renderNav() {
        const profileButton = document.getElementById('profile-button');
        const profileDropdown = document.getElementById('profile-dropdown');
        const profileName = document.getElementById('profile-name');

        if (state.isLoggedIn) {
            mainHeader.classList.remove('hidden');
            profileName.textContent = state.LOGGED_IN_SELLER;
            navLinksContainer.innerHTML = `<button data-page="dashboard" class="clay-button px-4 py-2 text-sm">Dashboard</button><button data-page="scheduler" class="clay-button px-4 py-2 text-sm">Scheduler</button>`;

            const profileLink = profileDropdown.querySelector('[data-page="userProfile"]');
            const userManagementLink = profileDropdown.querySelector('[data-page="userManagement"]');
            const bonusRulesLink = profileDropdown.querySelector('[data-page="bonusRules"]');

            if (state.userRole === 'seller') {
                profileLink.style.display = 'block';
                userManagementLink.style.display = 'none';
                bonusRulesLink.style.display = 'none';
            } else { // Admin
                profileLink.style.display = 'none';
                userManagementLink.style.display = 'block';
                bonusRulesLink.style.display = 'block';
            }

        } else {
            mainHeader.classList.add('hidden');
        }
    }

    // --- Page-Specific Initializers ---
    function setupLoginPage() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = mockUsers.find(u => u.email === email && u.password === password);

            if (user) {
                if(user.status === 'approved') {
                    state.isLoggedIn = true;
                    state.userId = user.id;
                    state.userRole = user.role;
                    state.LOGGED_IN_SELLER = user.name;
                    renderNav();
                    showPage('dashboard');
                } else {
                    showAlert('Login Failed', 'Your account is still pending approval.');
                }
            } else {
                showAlert('Login Failed', 'Invalid email or password. Please try again.');
            }
        });
        document.getElementById('show-signup').addEventListener('click', (e) => { e.preventDefault(); showPage('signup'); });
    }

    function setupSignupPage() {
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (name && email && password) {
                const newUser = {
                    id: mockUsers.length + 1,
                    name: name,
                    email: email,
                    password: password,
                    role: 'seller',
                    status: 'pending',
                    gcash: '',
                    contact: '',
                    emergencyContact: ''
                };
                mockUsers.push(newUser);
                showAlert('Account Created', 'Thank you for signing up! Your account is now pending admin approval.', () => {
                    showPage('login');
                });
            }
        });
        document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); showPage('login'); });
    }

    function setupDashboardPage() {
        const container = document.getElementById('dashboard-container');
        if (state.userRole === 'admin') {
            document.getElementById('dashboard-title').textContent = "Admin Dashboard";
            document.getElementById('dashboard-subtitle').textContent = "Platform-wide performance overview.";
            initializeAdminDashboard(container);
        } else {
             document.getElementById('dashboard-title').textContent = "Dashboard";
             document.getElementById('dashboard-subtitle').textContent = `Welcome back, ${state.LOGGED_IN_SELLER}!`;
             initializeSellerDashboard(container);
        }
    }

    function setupSchedulerPage() {
        if (calendarInstance) {
            calendarInstance.destroy();
        }
        initializeScheduler();
    }

    function setupUserProfilePage() {
        if (state.userRole !== 'seller' || state.userId === null) {
            showPage('login');
            return;
        }

        const user = mockUsers.find(u => u.id === state.userId);
        if (!user) {
            showAlert('Error', 'Could not find user data.');
            showPage('dashboard');
            return;
        }

        document.getElementById('profile-gcash').value = user.gcash || '';
        document.getElementById('profile-contact').value = user.contact || '';
        document.getElementById('profile-emergency').value = user.emergencyContact || '';

        document.getElementById('profile-info-form').addEventListener('submit', e => {
            e.preventDefault();
            user.gcash = document.getElementById('profile-gcash').value;
            user.contact = document.getElementById('profile-contact').value;
            user.emergencyContact = document.getElementById('profile-emergency').value;
            showAlert('Success', 'Your information has been updated.');
        });

        document.getElementById('password-change-form').addEventListener('submit', e => {
            e.preventDefault();
            const newPassword = document.getElementById('profile-new-password').value;
            const confirmPassword = document.getElementById('profile-confirm-password').value;

            if (!newPassword || newPassword !== confirmPassword) {
                showAlert('Error', 'Passwords do not match. Please try again.');
                return;
            }
            user.password = newPassword;
            showAlert('Success', 'Your password has been changed successfully.');
            e.target.reset();
        });
    }

    function setupUserManagementPage() {
        if (state.userRole !== 'admin') {
            showPage('login');
            return;
        }
        document.getElementById('close-user-details-btn').addEventListener('click', () => {
            document.getElementById('user-details-modal').classList.add('hidden');
        });
        renderUserList();
    }

    // --- Bonus Rules Page ---
    // These handlers are defined once and reused to prevent duplicates.
    const handleBonusFormSubmit = (e) => {
        e.preventDefault();
        const newRule = {
            id: mockBonusRules.length > 0 ? Math.max(...mockBonusRules.map(r => r.id)) + 1 : 1,
            name: document.getElementById('rule-name').value,
            description: document.getElementById('rule-description').value,
            startDate: document.getElementById('rule-start-date').value,
            endDate: document.getElementById('rule-end-date').value,
            liveHours: parseFloat(document.getElementById('rule-live-hours').value),
            brandedItems: parseInt(document.getElementById('rule-branded-items').value),
            freeSize: parseInt(document.getElementById('rule-free-size').value),
            timeFrame: document.getElementById('rule-time-frame').value,
            amount: parseFloat(document.getElementById('rule-bonus-amount').value),
        };
        mockBonusRules.push(newRule);
        renderBonusRulesList();
        document.getElementById('create-bonus-rule-modal').classList.add('hidden');
        showAlert('Success', 'New bonus rule has been created.');
    };

    const handleDeleteConfirm = (e) => {
         e.preventDefault();
         const adminPassword = document.getElementById('admin-password').value;
         const adminUser = mockUsers.find(u => u.role === 'admin');
         if (adminPassword === adminUser.password) {
             mockBonusRules = mockBonusRules.filter(r => r.id !== state.ruleToDelete);
             renderBonusRulesList();
             document.getElementById('delete-confirmation-modal').classList.add('hidden');
             showAlert('Success', 'Bonus rule has been deleted.');
         } else {
             showAlert('Error', 'Incorrect password. Deletion cancelled.');
         }
    };

    function setupBonusRulesPage() {
        if (state.userRole !== 'admin') {
            showPage('login');
            return;
        }

        const createRuleBtn = document.getElementById('create-new-rule-btn');
        const modal = document.getElementById('create-bonus-rule-modal');
        const form = document.getElementById('bonus-rule-form');
        const cancelBtn = document.getElementById('cancel-bonus-rule-btn');

        createRuleBtn.addEventListener('click', () => {
            form.reset();
            modal.classList.remove('hidden');
        });

        cancelBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Remove old listener before adding a new one to prevent duplicates
        form.removeEventListener('submit', handleBonusFormSubmit);
        form.addEventListener('submit', handleBonusFormSubmit);

        const deleteForm = document.getElementById('delete-confirm-form');
        deleteForm.removeEventListener('submit', handleDeleteConfirm);
        deleteForm.addEventListener('submit', handleDeleteConfirm);

        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            document.getElementById('delete-confirmation-modal').classList.add('hidden');
        });


        renderBonusRulesList();
    }

    function renderBonusRulesList() {
        const container = document.getElementById('bonus-rules-list');
        if(!container) return;

        if (mockBonusRules.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500">No bonus rules created yet.</p>`;
            return;
        }

        container.innerHTML = mockBonusRules.map(rule => `
            <div class="clay-card p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                       <h3 class="font-playfair text-2xl font-bold">${rule.name}</h3>
                       <p class="text-gray-600 text-sm mt-1">${rule.description}</p>
                    </div>
                    <button class="delete-rule-btn clay-button !p-2" data-ruleid="${rule.id}"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div class="clay-inset p-3">
                        <span class="block text-sm font-semibold text-gray-500 uppercase">Live Hours</span>
                        <span class="block text-xl font-bold">${rule.liveHours}</span>
                    </div>
                     <div class="clay-inset p-3">
                        <span class="block text-sm font-semibold text-gray-500 uppercase">Branded</span>
                        <span class="block text-xl font-bold">${rule.brandedItems}</span>
                    </div>
                     <div class="clay-inset p-3">
                        <span class="block text-sm font-semibold text-gray-500 uppercase">Free Size</span>
                        <span class="block text-xl font-bold">${rule.freeSize}</span>
                    </div>
                     <div class="clay-inset p-3">
                        <span class="block text-sm font-semibold text-gray-500 uppercase">Bonus</span>
                        <span class="block text-xl font-bold">₱${rule.amount.toFixed(2)}</span>
                    </div>
                </div>
                <div class="text-xs text-gray-500 mt-4 text-center">
                    Active: ${rule.startDate} to ${rule.endDate} | Evaluated ${rule.timeFrame.charAt(0).toUpperCase() + rule.timeFrame.slice(1)}
                </div>
            </div>
        `).join('');

         document.querySelectorAll('.delete-rule-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                state.ruleToDelete = parseInt(e.currentTarget.dataset.ruleid);
                document.getElementById('delete-confirmation-modal').classList.remove('hidden');
            });
        });
        lucide.createIcons();
    }

    function showUserDetailsModal(userId) {
        const user = mockUsers.find(u => u.id === userId);
        if (!user) return;
        document.getElementById('user-details-name').textContent = user.name;
        document.getElementById('user-details-gcash').textContent = user.gcash || 'Not set';
        document.getElementById('user-details-contact').textContent = user.contact || 'Not set';
        document.getElementById('user-details-emergency').textContent = user.emergencyContact || 'Not set';
        document.getElementById('user-details-modal').classList.remove('hidden');
    }

    function renderUserList() {
        const container = document.getElementById('user-list-container');
        if (!container) return;

        let userRows = mockUsers.filter(u => u.role !== 'admin').map((user, index) => `
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 ${index % 2 !== 0 ? 'bg-[rgba(0,0,0,0.04)]' : ''}">
                <div class="text-center sm:text-left flex-grow cursor-pointer view-user-details" data-userid="${user.id}">
                    <p class="font-bold">${user.name}</p>
                    <p class="text-sm text-gray-600">${user.email}</p>
                </div>
                <div class="flex items-center gap-2 mt-2 sm:mt-0">
                    ${user.status === 'pending' ?
                        `<button data-userid="${user.id}" class="approve-user-btn clay-button clay-button-approve px-3 py-2 text-sm">Approve</button>` :
                        `<span class="text-sm font-bold text-green-700 px-3 py-2">Approved</span>`
                    }
                    <button data-userid="${user.id}" class="reset-password-btn clay-button px-3 py-2 text-sm">Reset Password</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div>${userRows}</div>`;

        document.querySelectorAll('.view-user-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = parseInt(e.currentTarget.dataset.userid);
                showUserDetailsModal(userId);
            });
        });

        document.querySelectorAll('.approve-user-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('[data-userid]').dataset.userid);
                const user = mockUsers.find(u => u.id === userId);
                if (user) {
                    user.status = 'approved';
                    renderUserList();
                }
            });
        });

        document.querySelectorAll('.reset-password-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const userId = parseInt(e.target.closest('[data-userid]').dataset.userid);
                const user = mockUsers.find(u => u.id === userId);
                if (user) {
                    const tempPassword = 'password123';
                    user.password = tempPassword;
                    showAlert('Password Reset', `The password for ${user.name} has been reset to: ${tempPassword}`);
                }
            });
        });
    }


    function handleLogout() {
        state.isLoggedIn = false;
        state.userRole = null;
        state.userId = null;
        state.LOGGED_IN_SELLER = null;
        renderNav();
        showPage('login');
    }

    onMount(() => {
        appContainer = document.getElementById('app-container');
        mainHeader = document.getElementById('main-header');
        navLinksContainer = document.getElementById('nav-links');

        // --- Global Event Listeners ---
        document.body.addEventListener('click', (e) => {
            const pageButton = e.target.closest('[data-page]');
            if (pageButton) {
                e.preventDefault();
                const dropdown = document.getElementById('profile-dropdown');
                if (dropdown && !dropdown.classList.contains('hidden')) {
                    dropdown.classList.add('hidden');
                }
                showPage(pageButton.getAttribute('data-page'));
            }

            const profileDropdown = document.getElementById('profile-dropdown');
            const profileButton = document.getElementById('profile-button');
            if (profileDropdown && profileButton && !profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });

        const profileButton = document.getElementById('profile-button');
        if (profileButton) {
            profileButton.addEventListener('click', () => {
                 document.getElementById('profile-dropdown').classList.toggle('hidden');
            });
        }

        const logoutButton = document.getElementById('logout-button');
        if(logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }

        // --- App Initialization ---
        showPage('login');
    });


    // =================================================================================
    //  DASHBOARD MODULE (Admin & Seller)
    // =================================================================================

    function initializeAdminDashboard(container) {
        container.innerHTML = `<div class="clay-card p-4 mb-8"><div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"><div><label for="seller-filter" class="block text-sm font-medium mb-1">Filter by Seller</label><select id="seller-filter" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none"></select></div><div><label for="date-filter" class="block text-sm font-medium mb-1">Filter by Date Range</label><select id="date-filter" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none"><option>All Time</option><option>This Week</option><option>Last Week</option><option>This Month</option><option>Custom</option></select></div></div><div id="custom-date-filters" class="hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"><div><label for="start-date" class="block text-sm font-medium mb-1">Start Date</label><input type="date" id="start-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none"></div><div><label for="end-date" class="block text-sm font-medium mb-1">End Date</label><input type="date" id="end-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none"></div></div></div>
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="md:col-span-2 clay-card p-6 flex flex-col justify-center"><div class="flex items-center justify-between text-gray-600 mb-2"><h3 id="final-pay-label" class="text-lg font-semibold uppercase tracking-wider"></h3><i data-lucide="wallet" class="text-gray-500"></i></div><p id="final-pay" class="font-playfair text-6xl font-bold" style="color: #831843;">₱0.00</p></div>
        <div class="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="live-duration-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="live-duration" class="font-playfair text-3xl font-bold text-gray-800 mt-2">0.0 <span class="text-xl align-baseline">hrs</span></p></div>
            <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="base-pay-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="base-pay" class="font-playfair text-3xl font-bold text-gray-800 mt-2">₱0.00</p></div>
            <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="branded-sold-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="branded-sold" class="font-playfair text-3xl font-bold mt-2 text-gray-800">0</p></div>
            <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="free-size-sold-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="free-size-sold" class="font-playfair text-3xl font-bold mt-2 text-gray-800">0</p></div>
        </div>
    </div>
    <div class="clay-card p-6 mb-8">
        <h3 class="font-playfair text-2xl font-bold mb-4">Running Incentives</h3>
        <div id="bonus-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
    <div class="clay-card overflow-hidden"><h2 id="logged-entries-title" class="text-xl p-6 font-bold font-playfair border-b-2 border-dashed border-lavender-300"></h2><div id="table-container" class="overflow-x-auto"><table class="w-full table-auto"><thead class="text-gray-600"><tr></tr></thead><tbody id="table-body"></tbody></table></div><div id="no-entries" class="text-center p-8 text-gray-500 hidden">No entries found.</div><div id="pagination-controls" class="p-4 flex items-center justify-between flex-wrap gap-2"><span id="page-info" class="text-sm"></span><div class="flex items-center gap-2"><button id="prev-page" class="clay-button p-2 disabled:opacity-50"><i data-lucide="chevron-left"></i></button><button id="next-page" class="clay-button p-2 disabled:opacity-50"><i data-lucide="chevron-right"></i></button></div></div></div>`;
        runDashboardLogic('admin');
    }

    function initializeSellerDashboard(container){
         container.innerHTML = `
            <div class="clay-card p-4 mb-8">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex-grow flex flex-wrap items-end gap-4">
                        <div>
                            <label for="date-filter" class="block text-sm font-medium mb-1">Date Range</label>
                            <select id="date-filter" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none">
                                <option>All Time</option><option>This Week</option><option>Last Week</option><option>This Month</option><option>Custom</option>
                            </select>
                        </div>
                        <div id="custom-date-filters" class="hidden flex-grow sm:flex items-end gap-4">
                            <div>
                                <label for="start-date" class="block text-sm font-medium mb-1">Start</label>
                                <input type="date" id="start-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none">
                            </div>
                            <div>
                                <label for="end-date" class="block text-sm font-medium mb-1">End</label>
                                <input type="date" id="end-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none">
                            </div>
                        </div>
                    </div>
                    <div class="w-full sm:w-auto mt-4 sm:mt-0">
                         <button id="open-log-session-modal" class="clay-button clay-button-primary w-full px-6 py-4 text-lg">Log New Session</button>
                    </div>
                </div>
            </div>
             <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <div class="md:col-span-2 clay-card p-6 flex flex-col justify-center"><div class="flex items-center justify-between text-gray-600 mb-2"><h3 id="final-pay-label" class="text-lg font-semibold uppercase tracking-wider"></h3><i data-lucide="wallet" class="text-gray-500"></i></div><p id="final-pay" class="font-playfair text-6xl font-bold" style="color: #831843;">₱0.00</p></div>
                <div class="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="live-duration-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="live-duration" class="font-playfair text-3xl font-bold text-gray-800 mt-2">0.0 <span class="text-xl align-baseline">hrs</span></p></div>
                    <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="base-pay-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="base-pay" class="font-playfair text-3xl font-bold text-gray-800 mt-2">₱0.00</p></div>
                    <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="branded-sold-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="branded-sold" class="font-playfair text-3xl font-bold mt-2 text-gray-800">0</p></div>
                    <div class="clay-card p-4 flex flex-col justify-center text-center"><h3 id="free-size-sold-label" class="text-sm font-semibold uppercase tracking-wider text-gray-600"></h3><p id="free-size-sold" class="font-playfair text-3xl font-bold mt-2 text-gray-800">0</p></div>
                </div>
            </div>
            <div class="clay-card p-6 mb-8">
                <h3 class="font-playfair text-2xl font-bold mb-4">Running Incentives</h3>
                <div id="bonus-cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            </div>
            <div class="clay-card overflow-hidden"><h2 id="logged-entries-title" class="text-xl p-6 font-bold font-playfair border-b-2 border-dashed border-lavender-300"></h2><div id="table-container" class="overflow-x-auto"><table class="w-full table-auto"><thead class="text-gray-600"><tr></tr></thead><tbody id="table-body"></tbody></table></div><div id="no-entries" class="text-center p-8 text-gray-500 hidden">No entries found for the selected filters.</div><div id="pagination-controls" class="p-4 flex items-center justify-between flex-wrap gap-2"><span id="page-info" class="text-sm"></span><div class="flex items-center gap-2"><button id="prev-page" class="clay-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="chevron-left"></i></button><button id="next-page" class="clay-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"><i data-lucide="chevron-right"></i></button></div></div></div>`;
         runDashboardLogic('seller');
    }

    function runDashboardLogic(role) {
        const { LOGGED_IN_SELLER, userId } = state;
        const sellerFilter = document.getElementById('seller-filter');
        const dateFilter = document.getElementById('date-filter');
        const customDateFilters = document.getElementById('custom-date-filters');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const tableBody = document.getElementById('table-body');
        const tableHead = document.querySelector('#table-container thead tr');
        const noEntriesMessage = document.getElementById('no-entries');
        const paginationControls = document.getElementById('pagination-controls');
        const pageInfo = document.getElementById('page-info');
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const finalPayEl = document.getElementById('final-pay');
        const liveDurationEl = document.getElementById('live-duration');
        const basePayEl = document.getElementById('base-pay');
        const brandedSoldEl = document.getElementById('branded-sold');
        const freeSizeSoldEl = document.getElementById('free-size-sold');
        const finalPayLabel = document.getElementById('final-pay-label');
        const liveDurationLabel = document.getElementById('live-duration-label');
        const basePayLabel = document.getElementById('base-pay-label');
        const brandedSoldLabel = document.getElementById('branded-sold-label');
        const freeSizeSoldLabel = document.getElementById('free-size-sold-label');
        const loggedEntriesTitle = document.getElementById('logged-entries-title');
        const bonusCardsContainer = document.getElementById('bonus-cards-container');

        let dashboardAllData = [
            { id: 1, date: "2025-06-20", seller: "Seller A", seller_id: 1, liveDuration: 3.5, branded: 12, freeSize: 20 },
            { id: 2, date: "2025-06-19", seller: "Seller B", seller_id: 2, liveDuration: 4.0, branded: 25, freeSize: 15 },
            { id: 3, date: "2025-06-18", seller: "Seller A", seller_id: 1, liveDuration: 2.5, branded: 8, freeSize: 10 },
            { id: 4, date: "2025-06-17", seller: "Seller C", seller_id: 3, liveDuration: 3.0, branded: 18, freeSize: 30 },
            { id: 5, date: "2025-06-12", seller: "Seller B", seller_id: 2, liveDuration: 3.2, branded: 15, freeSize: 22 },
             { id: 6, date: "2025-06-19", seller: "Seller A", seller_id: 1, liveDuration: 5, branded: 50, freeSize: 70 },
        ];
        let dashboardFilteredData = [];
        let dashboardSortConfig = { key: 'date', direction: 'descending' };
        let dashboardCurrentPage = 1;
        const dashboardEntriesPerPage = 5;

        function showBonusDetailsModal(ruleId) {
            const rule = mockBonusRules.find(r => r.id === ruleId);
            if (!rule) return;

            document.getElementById('bonus-details-name').textContent = rule.name;
            document.getElementById('bonus-details-description').textContent = rule.description;
            document.getElementById('bonus-details-amount').textContent = `₱${rule.amount.toFixed(2)}`;
            document.getElementById('bonus-details-timeframe').textContent = rule.timeFrame.charAt(0).toUpperCase() + rule.timeFrame.slice(1);
            document.getElementById('bonus-details-start').textContent = rule.startDate;
            document.getElementById('bonus-details-end').textContent = rule.endDate;

            const targetsList = document.getElementById('bonus-details-targets');
            targetsList.innerHTML = `
                <li>Live Hours: ${rule.liveHours}</li>
                <li>Branded Items: ${rule.brandedItems}</li>
                <li>Free Size Items: ${rule.freeSize}</li>
            `;

            document.getElementById('bonus-rule-details-modal').classList.remove('hidden');
            document.getElementById('close-bonus-details-btn').onclick = () => {
                 document.getElementById('bonus-rule-details-modal').classList.add('hidden');
            };
        }

        function renderBonusCards(performanceData, filterRange) {
            const today = new Date();
            today.setHours(0,0,0,0);

            const activeRules = mockBonusRules.filter(rule => {
                const ruleEnd = new Date(rule.endDate);
                ruleEnd.setHours(23,59,59,999);
                return ruleEnd >= today;
            });

            if (activeRules.length === 0) {
                bonusCardsContainer.innerHTML = `<p class="text-center text-gray-500 col-span-full">No active bonus incentives at the moment.</p>`;
                return;
            }

            bonusCardsContainer.innerHTML = activeRules.map(rule => {
                const ruleStart = new Date(rule.startDate);
                const ruleEnd = new Date(rule.endDate);
                ruleEnd.setHours(23,59,59,999);

                const isApplicableInFilter = (!filterRange.start || ruleEnd >= filterRange.start) && (!filterRange.end || ruleStart <= filterRange.end);

                let earnedAmount = 0;
                if(isApplicableInFilter) {
                    const targetMetrics = performanceData.reduce((acc, item) => {
                        acc.liveHours += item.liveDuration || 0;
                        acc.brandedItems += item.branded || 0;
                        acc.freeSize += item.freeSize || 0;
                        return acc;
                    }, { liveHours: 0, brandedItems: 0, freeSize: 0 });

                    if (targetMetrics.liveHours >= rule.liveHours &&
                        targetMetrics.brandedItems >= rule.brandedItems &&
                        targetMetrics.freeSize >= rule.freeSize) {
                        earnedAmount = rule.amount;
                    }
                }

                return `
                    <div class="clay-card p-4 cursor-pointer ${!isApplicableInFilter ? 'opacity-50' : ''}" data-ruleid="${rule.id}">
                         <div class="flex justify-between items-start">
                            <h4 class="font-playfair font-bold text-lg mb-2">${rule.name}</h4>
                            <div class="tooltip-container">
                                <i data-lucide="info" class="h-5 w-5 text-gray-500"></i>
                                <span class="tooltip-text">Targets: ${rule.liveHours} hrs, ${rule.brandedItems} branded, ${rule.freeSize} free-size</span>
                            </div>
                        </div>
                        <p class="font-bold text-3xl" style="color: #831843;">₱${earnedAmount.toFixed(2)}</p>
                        <p class="text-xs text-gray-500 mt-1">${rule.timeFrame.charAt(0).toUpperCase() + rule.timeFrame.slice(1)} Bonus</p>
                    </div>
                `;
            }).join('');

            document.querySelectorAll('[data-ruleid]').forEach(card => {
                card.addEventListener('click', (e) => {
                     const ruleId = parseInt(e.currentTarget.dataset.ruleid);
                     showBonusDetailsModal(ruleId);
                });
            });

            lucide.createIcons();
        }

        function update() {
            let data = [...dashboardAllData];
            let currentSellerId = null;

            if (role === 'seller') {
                data = data.filter(item => item.seller_id === userId);
                currentSellerId = userId;
            } else if(sellerFilter) {
                const selectedSellerName = sellerFilter.value;
                if (selectedSellerName !== 'All Sellers') {
                    const selectedSeller = mockUsers.find(u => u.name === selectedSellerName);
                    if(selectedSeller) {
                        data = data.filter(item => item.seller_id === selectedSeller.id);
                        currentSellerId = selectedSeller.id;
                    }
                }
            }

            let range = { start: null, end: null };
             switch (dateFilter.value) {
                case 'This Week': range = getWeekRange('this'); break;
                case 'Last Week': range = getWeekRange('last'); break;
                case 'This Month': range = getMonthRange('this'); break;
                case 'Custom':
                    if (startDateInput.value && endDateInput.value) {
                       range.start = parseDateAsUTC(startDateInput.value);
                       range.end = parseDateAsUTC(endDateInput.value);
                       if(range.end) range.end.setUTCHours(23,59,59,999);
                    }
                    break;
                default: break;
            }
            if (range.start && range.end) {
                data = data.filter(item => {
                    const itemDate = parseDateAsUTC(item.date);
                    return itemDate && itemDate >= range.start && itemDate <= range.end;
                });
            }
            dashboardFilteredData = data;

            const metrics = dashboardFilteredData.reduce((acc, item) => {
                acc.duration += item.liveDuration || 0;
                acc.basePay += (item.liveDuration || 0) * 83.3;
                acc.branded += item.branded || 0;
                acc.freeSize += item.freeSize || 0;
                return acc;
            }, { duration: 0, basePay: 0, branded: 0, freeSize: 0 });

            let totalBonusAmount = 0;
            const today = new Date();
            today.setHours(0,0,0,0);
            const activeAndApplicableRules = mockBonusRules.filter(rule => {
                const ruleStart = new Date(rule.startDate);
                const ruleEnd = new Date(rule.endDate);
                ruleEnd.setHours(23,59,59,999);
                const isDateActive = ruleStart <= today && ruleEnd >= today;
                const isFilterApplicable = (!range.start || ruleEnd >= range.start) && (!range.end || ruleStart <= range.end);
                return isDateActive && isFilterApplicable;
            });

            activeAndApplicableRules.forEach(rule => {
                 // Recalculate metrics for the specific rule's timeframe if necessary,
                 // but for simplicity given existing data structure, we use overall filtered data
                 // This section would need more complex logic for truly dynamic bonus calculation per timeframe
                if (metrics.duration >= rule.liveHours &&
                    metrics.branded >= rule.brandedItems &&
                    metrics.freeSize >= rule.freeSize) {
                    totalBonusAmount += rule.amount;
                }
            });


            renderBonusCards(dashboardFilteredData, range);


            const finalPay = metrics.basePay + totalBonusAmount;
            const sellerName = (role === 'admin' && sellerFilter) ? sellerFilter.value : LOGGED_IN_SELLER;
            const isAllSellers = role === 'admin' && sellerName === 'All Sellers';

            finalPayLabel.textContent = "Final Pay";
            liveDurationLabel.textContent = "Live Duration";
            basePayLabel.textContent = "Base Pay";
            brandedSoldLabel.textContent = "Branded Sold";
            freeSizeSoldLabel.textContent = "Free Size Sold";
            loggedEntriesTitle.textContent = isAllSellers ? 'All Logged Entries' : `${sellerName} Logged Entries`;

            finalPayEl.textContent = `₱${finalPay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            liveDurationEl.innerHTML = `${metrics.duration.toFixed(1)} <span class="text-xl align-baseline">hrs</span>`;
            basePayEl.textContent = `₱${metrics.basePay.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
            brandedSoldEl.textContent = metrics.branded.toLocaleString();
            freeSizeSoldEl.textContent = metrics.freeSize.toLocaleString();

            dashboardFilteredData.sort((a, b) => {
                let aValue = a[dashboardSortConfig.key];
                let bValue = b[dashboardSortConfig.key];
                if (dashboardSortConfig.key === 'date') { aValue = new Date(a.date); bValue = new Date(b.date); }
                if (aValue < bValue) return dashboardSortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return dashboardSortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
            renderDashboardTable();
            renderDashboardPagination();
            lucide.createIcons();
        }
        function renderDashboardTable() {
             tableHead.innerHTML = '';
             tableBody.innerHTML = '';
             const headers = [ { label: 'Date', key: 'date' }, { label: 'Duration', key: 'liveDuration' }, { label: 'Branded', key: 'branded' }, { label: 'Free Size', key: 'freeSize' }];
             if (role === 'admin') {
                headers.splice(1, 0, { label: 'Seller', key: 'seller' });
             }
             headers.forEach(h => tableHead.appendChild(createSortableHeader(h.label, h.key)));
             const startIndex = (dashboardCurrentPage - 1) * dashboardEntriesPerPage;
             const paginatedData = dashboardFilteredData.slice(startIndex, startIndex + dashboardEntriesPerPage);
             noEntriesMessage.style.display = paginatedData.length === 0 ? 'block' : 'none';
             paginatedData.forEach((item, index) => {
                const duration = item.liveDuration || 0;
                const itemDate = new Date(item.date + 'T00:00:00');
                const row = document.createElement('tr');
                row.className = 'transition-colors duration-200 hover:bg-primary-lavender/60 ' + (index % 2 !== 0 ? 'bg-[rgba(0,0,0,0.04)]' : '');
                row.innerHTML = `<td class="p-4 whitespace-nowrap">${itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td> ${role === 'admin' ? `<td class="p-4 whitespace-nowrap">${item.seller}</td>` : ''} <td class="p-4 whitespace-nowrap">${duration.toFixed(2)} hrs</td> <td class="p-4 whitespace-nowrap">${item.branded}</td> <td class="p-4 whitespace-nowrap">${item.freeSize}</td>`;
                tableBody.appendChild(row);
             });
        }
        function renderDashboardPagination() {
            const totalPages = Math.ceil(dashboardFilteredData.length / dashboardEntriesPerPage);
            paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
            pageInfo.innerHTML = `Page <strong>${dashboardCurrentPage}</strong> of <strong>${totalPages}</strong>`;
            prevPageBtn.disabled = dashboardCurrentPage === 1;
            nextPageBtn.disabled = dashboardCurrentPage === totalPages;
        }
        function createSortableHeader(label, key) {
            const th = document.createElement('th');
            th.className = "p-4 text-left font-semibold uppercase tracking-wider text-xs cursor-pointer";
            th.dataset.key = key;
            const iconContainer = dashboardSortConfig.key === key ? `<i data-lucide="${dashboardSortConfig.direction === 'ascending' ? 'chevron-up' : 'chevron-down'}" class="h-4 w-4 ml-1"></i>` : '<div class="h-4 w-4 ml-1 opacity-20"><i data-lucide="chevron-down"></i></div>';
            th.innerHTML = `<div class="flex items-center">${label}${iconContainer}</div>`;
            th.addEventListener('click', () => {
                dashboardSortConfig.direction = (dashboardSortConfig.key === key && dashboardSortConfig.direction === 'ascending') ? 'descending' : 'ascending';
                dashboardSortConfig.key = key;
                dashboardCurrentPage = 1;
                update();
            });
            return th;
        }

        if (role === 'admin' && sellerFilter) {
            const approvedSellers = mockUsers.filter(u => u.status === 'approved' && u.role === 'seller').map(u => u.name);
            const uniqueSellers = ['All Sellers', ...approvedSellers];
            sellerFilter.innerHTML = uniqueSellers.map(s => `<option value="${s}">${s}</option>`).join('');
            sellerFilter.addEventListener('change', () => { dashboardCurrentPage = 1; update(); });
        } else if (role === 'seller') {
            const logSessionModal = document.getElementById('log-session-modal');
            const sessionLogForm = document.getElementById('session-log-form');

            document.getElementById('open-log-session-modal').addEventListener('click', () => {
                sessionLogForm.reset();
                logSessionModal.classList.remove('hidden');
            });
            document.getElementById('cancel-log-session-btn').addEventListener('click', () => {
                logSessionModal.classList.add('hidden');
            });

            sessionLogForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const startStr = document.getElementById('session-start').value;
                const endStr = document.getElementById('session-end').value;
                const branded = parseInt(document.getElementById('branded-items').value) || 0;
                const freeSize = parseInt(document.getElementById('free-size-items').value) || 0;

                if (!startStr || !endStr) {
                    showAlert('Error', 'Please select both a start and end time.');
                    return;
                }
                const startDate = new Date(startStr);
                const endDate = new Date(endStr);

                if (endDate <= startDate) {
                    showAlert('Error', 'End time must be after the start time.');
                    return;
                }

                const duration = (endDate - startDate) / (1000 * 60 * 60);

                const newEntry = {
                    id: dashboardAllData.length + 1,
                    date: startDate.toISOString().split('T')[0],
                    seller: LOGGED_IN_SELLER,
                    seller_id: userId,
                    liveDuration: duration,
                    branded: branded,
                    freeSize: freeSize,
                };

                dashboardAllData.unshift(newEntry);
                update(); // Re-render the dashboard
                logSessionModal.classList.add('hidden');
                showAlert('Success', 'Your session has been logged successfully!');
            });
        }

        if(dateFilter) {
            dateFilter.addEventListener('change', () => {
                const showCustom = dateFilter.value === 'Custom';
                if(customDateFilters) {
                    customDateFilters.classList.toggle('hidden', !showCustom);
                    if(role === 'seller') customDateFilters.classList.toggle('sm:flex', showCustom);
                }
                if (!showCustom) { dashboardCurrentPage = 1; update(); }
            });
        }
        if(startDateInput) startDateInput.addEventListener('change', () => { dashboardCurrentPage = 1; update(); });
        if(endDateInput) endDateInput.addEventListener('change', () => { dashboardCurrentPage = 1; update(); });
        if(prevPageBtn) prevPageBtn.addEventListener('click', () => { if(dashboardCurrentPage > 1) { dashboardCurrentPage--; renderDashboardTable(); renderDashboardPagination(); } });
        if(nextPageBtn) nextPageBtn.addEventListener('click', () => { const totalPages = Math.ceil(dashboardFilteredData.length / dashboardEntriesPerPage); if(dashboardCurrentPage < totalPages) { dashboardCurrentPage++; renderDashboardTable(); renderDashboardPagination(); } });

        update();
    }

    // =================================================================================
    //  SCHEDULER MODULE (Full Implementation)
    // =================================================================================
    function initializeScheduler() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;
        if(calendarInstance) {
            calendarInstance.destroy();
            calendarInstance = null;
        }

        const bookingModal = document.getElementById('booking-modal');
        const eventDetailsModal = document.getElementById('event-details-modal');
        const bookingForm = document.getElementById('booking-form');
        const eventTitleInput = document.getElementById('event-title');
        const startTimeInput = document.getElementById('start-time');
        const cancelBookingBtn = document.getElementById('cancel-booking-btn');
        const eventDetailsTitle = document.getElementById('event-details-title');
        const eventDetailsTime = document.getElementById('event-details-time');
        const eventDetailsStatus = document.getElementById('event-details-status');
        const eventDetailsActions = document.getElementById('event-details-actions');
        const closeDetailsBtn = document.getElementById('close-details-btn');

        let activeEvent = null;
        let currentSelectionInfo = null;
        const { LOGGED_IN_SELLER, userRole } = state;

        const isMobile = window.innerWidth < 768;

        calendarInstance = new Calendar(calendarEl, {
            plugins: [ dayGridPlugin, timeGridPlugin ], // Added plugins here
            initialView: isMobile ? 'dayGridWeek' : 'dayGridMonth',
            headerToolbar: isMobile ? {
                left: 'prev,next',
                center: 'title',
                right: 'today'
            } : {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,timeGridDay'
            },
            windowResizeDelay: 250,
            windowResize: function(arg) {
                const mobile = window.innerWidth < 768;
                this.changeView(mobile ? 'dayGridWeek' : 'dayGridMonth');
                this.setOption('headerToolbar', mobile ? {
                    left: 'prev,next',
                    center: 'title',
                    right: 'today'
                } : {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,timeGridDay'
                });
            },
            firstDay: 3,
            dateClick: function(info) {
                if (userRole !== 'seller') return;

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (info.date < today) {
                    showAlert('Invalid Date', 'You cannot book a session in the past.');
                    return;
                }

                bookingForm.reset();
                currentSelectionInfo = info;
                eventTitleInput.value = LOGGED_IN_SELLER;
                bookingModal.classList.remove('hidden');
            },
            events: [ // Sample events to demonstrate all states
                { id: '1', title: 'Seller A', start: '2025-06-23T10:00:00', end: '2025-06-23T13:00:00', extendedProps: { owner: 'Seller A', status: 'locked'}, classNames: ['event-locked'] },
                { id: '2', title: 'Seller B (Pending)', start: '2025-06-24T14:00:00', end: '2025-06-24T17:00:00', extendedProps: { owner: 'Seller B', status: 'pending'}, classNames: ['event-pending'] },
                { id: '3', title: 'TAKE OVER', start: '2025-06-25T12:00:00', end: '2025-06-25T15:00:00', extendedProps: { owner: 'Seller C', status: 'takeover', originalOwner: 'Seller C' }, classNames: ['event-takeover'] },
            ],
            eventClick: (info) => {
                activeEvent = info.event;
                const props = activeEvent.extendedProps;
                const isMine = props.owner === LOGGED_IN_SELLER;

                eventDetailsTitle.textContent = activeEvent.title;
                eventDetailsTime.textContent = `From ${activeEvent.start.toLocaleTimeString()} to ${activeEvent.end.toLocaleTimeString()}`;
                eventDetailsStatus.textContent = `Status: ${props.status.charAt(0).toUpperCase() + props.status.slice(1).replace('_', ' ')}`;
                eventDetailsActions.innerHTML = '';

                if (userRole === 'admin') {
                    if (props.status === 'pending') {
                        eventDetailsActions.innerHTML = `<button id="approve-btn" class="clay-button clay-button-approve w-full p-4 text-xl">Approve</button><button id="deny-btn" class="clay-button clay-button-deny w-full p-4 text-xl">Deny</button>`;
                        document.getElementById('approve-btn').onclick = () => {
                            activeEvent.setExtendedProp('status', 'locked');
                            activeEvent.setProp('classNames', ['event-locked']);
                            activeEvent.setProp('title', props.owner);
                            eventDetailsModal.classList.add('hidden');
                        };
                        document.getElementById('deny-btn').onclick = () => {
                            activeEvent.remove();
                            eventDetailsModal.classList.add('hidden');
                        };
                    } else if (props.status === 'locked') {
                        eventDetailsActions.innerHTML = `<button id="force-cancel-btn" class="clay-button clay-button-deny w-full p-4 text-xl">Force Cancellation</button>`;
                        document.getElementById('force-cancel-btn').onclick = () => {
                            activeEvent.setExtendedProp('status', 'takeover');
                            activeEvent.setExtendedProp('originalOwner', props.owner);
                            activeEvent.setProp('classNames', ['event-takeover']);
                            activeEvent.setProp('title', 'NEEDS TAKEOVER');
                            eventDetailsModal.classList.add('hidden');
                        };
                    } else if (props.status === 'takeover_pending') {
                        eventDetailsActions.innerHTML = `<p class="text-center w-full text-gray-700 font-semibold">Takeover requested by: ${props.requestedBy}</p><button id="approve-takeover-btn" class="clay-button clay-button-approve w-full p-4 text-xl">Approve Takeover</button>`;
                        document.getElementById('approve-takeover-btn').onclick = () => {
                            activeEvent.setExtendedProp('status', 'locked');
                            activeEvent.setExtendedProp('owner', props.requestedBy);
                            activeEvent.setProp('classNames', ['event-locked']);
                            activeEvent.setProp('title', props.requestedBy);
                            eventDetailsModal.classList.add('hidden');
                        };
                    } else {
                         eventDetailsActions.innerHTML = `<p class="text-center w-full text-gray-600">No admin actions for this state.</p>`;
                    }
                } else if (userRole === 'seller') {
                    if (isMine && props.status === 'locked') {
                        eventDetailsActions.innerHTML = `<button id="cancel-session-btn" class="clay-button clay-button-deny w-full p-4 text-xl">Cancel My Session</button>`;
                        document.getElementById('cancel-session-btn').onclick = () => {
                            activeEvent.setExtendedProp('status', 'takeover');
                            activeEvent.setExtendedProp('originalOwner', props.owner);
                            activeEvent.setProp('classNames', ['event-takeover']);
                            activeEvent.setProp('title', 'NEEDS TAKEOVER');
                            eventDetailsModal.classList.add('hidden');
                        };
                    } else if (!isMine && props.status === 'takeover') {
                        eventDetailsActions.innerHTML = `<button id="claim-takeover-btn" class="clay-button clay-button-primary w-full p-4 text-xl">Claim This Session</button>`;
                         document.getElementById('claim-takeover-btn').onclick = () => {
                            activeEvent.setExtendedProp('status', 'takeover_pending');
                            activeEvent.setExtendedProp('requestedBy', LOGGED_IN_SELLER);
                            activeEvent.setProp('title', `Takeover Pending (${LOGGED_IN_SELLER})`);
                            eventDetailsModal.classList.add('hidden');
                        };
                    }
                    else {
                        eventDetailsActions.innerHTML = `<p class="text-center w-full text-gray-600">No actions available for you.</p>`;
                    }
                }

                eventDetailsModal.classList.remove('hidden');
            }
        });

        calendarInstance.render();

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = eventTitleInput.value;
            const startTimeValue = startTimeInput.value;
            if(title && startTimeValue && currentSelectionInfo){
                const [hours, minutes] = startTimeValue.split(':');
                const startDateTime = new Date(currentSelectionInfo.date);
                startDateTime.setHours(hours, minutes, 0, 0);
                const endDateTime = new Date(startDateTime.getTime() + (3 * 60 * 60 * 1000));
                calendarInstance.addEvent({
                    title: `${title} (Pending)`,
                    start: startDateTime,
                    end: endDateTime,
                    extendedProps: {owner: title, status: 'pending'},
                    classNames: ['event-pending']
                });
                bookingModal.classList.add('hidden');
            }
        });
        cancelBookingBtn.addEventListener('click', () => bookingModal.classList.add('hidden'));
        closeDetailsBtn.addEventListener('click', () => eventDetailsModal.classList.add('hidden'));
    }
</script>

<style>
    :root {
        --bg-lavender: #E6E0F8;
        --primary-mint: #C1E1C1; /* Green for Locked/Approved */
        --primary-lavender: #D6C6E4;
        --action-pink: #FFC0CB;
        --action-yellow: #FDFD96; /* Yellow for Pending */
        --action-red: #FFB3B3;   /* Red for Needs Takeover */
        --text-dark: #3D3D3D;
        --shadow-light: rgba(255, 255, 255, 0.7);
        --shadow-dark: rgba(0, 0, 0, 0.15);
        --highlight-today: rgba(214, 198, 228, 0.5);
        --zebra-stripe: rgba(0,0,0,0.04);
    }
    /* The 'body' selector should ideally be in a global CSS file, like src/app.css, not here.
       However, for a direct migration, keep it if it's strictly necessary and you understand the implication. */
    /* body { font-family: 'Lato', sans-serif; background-color: var(--bg-lavender); color: var(--text-dark); } */
    /* Instead, consider applying these to a higher-level div if you want to scope it to the Svelte app */

    .font-playfair { font-family: 'Playfair Display', serif; }
    .clay-card { border-radius: 20px; background: var(--bg-lavender); box-shadow: -8px -8px 16px var(--shadow-light), 8px 8px 16px var(--shadow-dark); }
    .clay-inset { border-radius: 16px; background: var(--bg-lavender); box-shadow: inset -4px -4px 8px var(--shadow-light), inset 4px 4px 8px var(--shadow-dark); }
    .clay-button { border-radius: 16px; background: var(--bg-lavender); font-weight: 700; transition: all 0.1s ease-in-out; box-shadow: -6px -6px 12px var(--shadow-light), 6px 6px 12px var(--shadow-dark); }
    .clay-button:active { transform: scale(0.98); box-shadow: -2px -2px 6px var(--shadow-light), 2px 2px 6px var(--shadow-dark); }
    .clay-button-primary { background-color: var(--action-pink); }
    .clay-button-approve { background-color: var(--primary-mint); }
    .clay-button-deny { background-color: var(--action-red); }
    .fc { border: none; }
    .fc .fc-toolbar-title { font-family: 'Playfair Display', serif; color: var(--text-dark); font-size: 1.25rem; }
    .fc .fc-button-primary { background-color: var(--primary-lavender) !important; border: none !important; box-shadow: -2px -2px 6px var(--shadow-light), 2px 2px 6px var(--shadow-dark) !important; }
    .fc .fc-button-primary:active { box-shadow: inset -2px -2px 6px var(--shadow-light), inset 2px 2px 6px var(--shadow-dark) !important; }
    .fc .fc-daygrid-day-frame { border-radius: 16px; transition: background-color 0.2s; }
    .fc .fc-daygrid-day:hover .fc-daygrid-day-frame { background-color: rgba(255, 255, 255, 0.4); }
    .fc .fc-daygrid-day-number { padding: 8px; }
    .fc .fc-day-today .fc-daygrid-day-frame { background-color: var(--highlight-today); }
    .fc-event { border: none !important; border-radius: 10px !important; padding: 4px 8px !important; box-shadow: -3px -3px 8px var(--shadow-light), 3px 3px 8px var(--shadow-dark) !important; cursor: pointer; }
    .fc-event-main { font-weight: 600; color: var(--text-dark) !important; }
    .fc-event.event-locked { background-color: var(--primary-mint) !important; }
    .fc-event.event-pending { background-color: var(--action-yellow) !important; }
    .fc-event.event-takeover { background-color: var(--action-red) !important; }

    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    .tooltip-text {
        visibility: hidden;
        width: 200px;
        background-color: #555;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 10;
        bottom: 125%;
        left: 50%;
        margin-left: -100px;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip-text::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip-container:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
</style>

<div class="p-4 sm:p-6 md:p-8">

    <header id="main-header" class="hidden clay-card p-4 mb-8 sticky top-4 z-40">
        <nav class="flex flex-wrap items-center justify-between gap-4">
            <div id="nav-links" class="flex items-center gap-2">
                </div>
            <div class="relative">
                <button id="profile-button" class="flex items-center gap-3">
                    <div class="bg-white p-2 rounded-full shadow-inner">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2Z" fill="#831843"/><path d="M12 14C9.33333 14 4 15.3333 4 18V22H20V18C20 15.3333 14.6667 14 12 14Z" fill="#d97706"/><path d="M12 2C13.5 2 15 3 15 5C15 7 12 9 12 9C12 9 9 7 9 5C9 3 10.5 2 12 2Z" fill="#fdf8f6"/>
                        </svg>
                    </div>
                    <span id="profile-name" class="font-playfair font-bold text-xl"></span>
                </button>
                <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-48 clay-card p-2 z-50">
                     <a href="#" data-page="userProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-lavender rounded-lg">Profile</a>
                     <a href="#" data-page="userManagement" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-lavender rounded-lg">User Management</a>
                     <a href="#" data-page="bonusRules" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-lavender rounded-lg">Bonus Rules</a>
                     <a href="#" id="logout-button" class="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-lavender rounded-lg">Logout</a>
                </div>
            </div>
        </nav>
    </header>

    <div id="app-container">
        </div>

    <div id="delete-confirmation-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-md p-6 sm:p-8">
            <h2 class="font-playfair text-2xl font-bold text-gray-700 mb-4">Confirm Deletion</h2>
            <p class="text-gray-600 mb-6">To delete this bonus rule, please enter your password to confirm.</p>
            <form id="delete-confirm-form">
                 <div><label for="admin-password" class="block text-sm font-medium mb-2">Admin Password</label><input type="password" id="admin-password" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                 <div class="pt-6 flex flex-col sm:flex-row gap-4">
                     <button type="submit" id="confirm-delete-btn" class="clay-button clay-button-deny w-full p-4 text-xl">Delete</button>
                     <button type="button" id="cancel-delete-btn" class="clay-button w-full p-4 text-xl">Cancel</button>
                 </div>
            </form>
        </div>
    </div>
     <div id="bonus-rule-details-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-2xl p-6 sm:p-8">
             <h2 id="bonus-details-name" class="font-playfair text-3xl font-bold text-gray-700 mb-2"></h2>
             <p id="bonus-details-description" class="text-gray-600 mb-6"></p>
             <div class="space-y-4">
                 <div class="clay-card p-4">
                    <h3 class="font-playfair text-xl font-bold mb-2">Targets</h3>
                    <ul id="bonus-details-targets" class="list-disc list-inside space-y-1"></ul>
                 </div>
                 <div class="clay-card p-4">
                     <h3 class="font-playfair text-xl font-bold mb-2">Details</h3>
                     <div class="grid grid-cols-2 gap-4">
                        <p><strong>Bonus:</strong> <span id="bonus-details-amount"></span></p>
                        <p><strong>Time Frame:</strong> <span id="bonus-details-timeframe"></span></p>
                        <p><strong>Starts:</strong> <span id="bonus-details-start"></span></p>
                        <p><strong>Ends:</strong> <span id="bonus-details-end"></span></p>
                     </div>
                 </div>
             </div>
             <button type="button" id="close-bonus-details-btn" class="clay-button w-full p-4 text-xl text-gray-700 mt-8">Close</button>
        </div>
    </div>
    <div id="create-bonus-rule-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-3xl p-6 sm:p-8 flex flex-col max-h-[95vh]">
             <h2 class="font-playfair text-3xl font-bold text-gray-700 mb-6 flex-shrink-0">Create New Bonus Rule</h2>
             <form id="bonus-rule-form" class="space-y-6 overflow-y-auto pr-2">
                 <div class="clay-card p-6">
                    <h3 class="font-playfair text-xl font-bold mb-4">Basic Information</h3>
                    <div class="space-y-4">
                        <div><label for="rule-name" class="block text-sm font-medium mb-1">Rule Name</label><input type="text" id="rule-name" placeholder="e.g., Monthly Excellence Bonus" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                        <div><label for="rule-description" class="block text-sm font-medium mb-1">Description</label><textarea id="rule-description" placeholder="Brief description of the bonus requirements" rows="3" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none"></textarea></div>
                    </div>
                 </div>
                 <div class="clay-card p-6">
                    <h3 class="font-playfair text-xl font-bold mb-4">Active Period</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label for="rule-start-date" class="block text-sm font-medium mb-1">Start Date</label><input type="date" id="rule-start-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                        <div><label for="rule-end-date" class="block text-sm font-medium mb-1">End Date</label><input type="date" id="rule-end-date" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                    </div>
                 </div>
                 <div class="clay-card p-6">
                    <h3 class="font-playfair text-xl font-bold mb-4">Target Requirements (All must be met)</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div><label for="rule-live-hours" class="block text-sm font-medium mb-1">Live Hours Target</label><input type="number" id="rule-live-hours" placeholder="e.g., 40" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                        <div><label for="rule-branded-items" class="block text-sm font-medium mb-1">Branded Items Target</label><input type="number" id="rule-branded-items" placeholder="e.g., 60" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                        <div><label for="rule-free-size" class="block text-sm font-medium mb-1">Free Size Target</label><input type="number" id="rule-free-size" placeholder="e.g., 100" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                    </div>
                 </div>
                 <div class="clay-card p-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label for="rule-time-frame" class="block text-sm font-medium mb-1">Time Frame</label><select id="rule-time-frame" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></div>
                        <div><label for="rule-bonus-amount" class="block text-sm font-medium mb-1">Bonus Amount (₱)</label><input type="number" step="0.01" id="rule-bonus-amount" placeholder="0.00" class="clay-inset w-full p-3 text-lg appearance-none focus:outline-none" required></div>
                    </div>
                 </div>
                <div class="pt-4 flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Create Rule</button>
                    <button type="button" id="cancel-bonus-rule-btn" class="clay-button w-full p-4 text-xl text-gray-700">Cancel</button>
                </div>
            </form>
        </div>
    </div>
    <div id="log-session-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-2xl p-6 sm:p-8">
             <h2 class="font-playfair text-3xl font-bold text-gray-700 mb-6">Log New Session</h2>
             <form id="session-log-form" class="space-y-8">
                <fieldset class="grid grid-cols-1 sm:grid-cols-2 gap-6"><legend class="sr-only">Session Start and End Time</legend>
                    <div><label for="session-start" class="block text-sm font-medium mb-2">Session Start</label><input type="datetime-local" id="session-start" name="session-start" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                    <div><label for="session-end" class="block text-sm font-medium mb-2">Session End</label><input type="datetime-local" id="session-end" name="session-end" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                </fieldset>
                <fieldset><legend class="font-playfair text-2xl font-bold mb-4">Items Sold</legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-6"><div><label for="branded-items" class="block text-sm font-medium mb-2">Branded Items</label><input type="number" id="branded-items" name="branded-items" value="0" min="0" placeholder="0" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div><div><label for="free-size-items" class="block text-sm font-medium mb-2">Free Size Items</label><input type="number" id="free-size-items" name="free-size-items" value="0" min="0" placeholder="0" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none"></div></div></fieldset>
                <div class="pt-4 flex flex-col sm:flex-row gap-4">
                    <button type="submit" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Submit Log</button>
                    <button type="button" id="cancel-log-session-btn" class="clay-button w-full p-4 text-xl text-gray-700">Cancel</button>
                </div>
            </form>
        </div>
    </div>
    <div id="user-details-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-lg p-6 sm:p-8">
            <h2 id="user-details-name" class="font-playfair text-3xl font-bold text-gray-700 mb-6"></h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-500">GCash Number</label>
                    <p id="user-details-gcash" class="clay-inset w-full p-4 text-lg"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Contact Number</label>
                    <p id="user-details-contact" class="clay-inset w-full p-4 text-lg"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500">Emergency Contact</label>
                    <p id="user-details-emergency" class="clay-inset w-full p-4 text-lg"></p>
                </div>
            </div>
            <button type="button" id="close-user-details-btn" class="clay-button w-full p-4 text-xl text-gray-700 mt-8">Close</button>
        </div>
    </div>
    <div id="booking-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-lg p-6 sm:p-8">
            <h2 class="font-playfair text-3xl font-bold text-gray-700 mb-4">Book Session</h2>
            <form id="booking-form" class="space-y-6">
                <div><label for="event-title" class="block text-sm font-medium mb-2">Your Name</label><input type="text" id="event-title" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required readonly></div>
                <div><label for="start-time" class="block text-sm font-medium mb-2">Session Start Time</label><input type="time" id="start-time" class="clay-inset w-full p-4 text-lg appearance-none focus:outline-none" required></div>
                <p class="text-center text-sm font-semibold h-4 text-gray-600">Session will be booked for 3 hours.</p>
                <div class="pt-4 flex flex-col sm:flex-row gap-4"><button type="submit" id="book-session-btn" class="clay-button clay-button-primary w-full p-4 text-xl text-gray-800">Request Booking</button><button type="button" id="cancel-booking-btn" class="clay-button w-full p-4 text-xl text-gray-700">Cancel</button></div>
            </form>
        </div>
    </div>
    <div id="event-details-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-lg p-6 sm:p-8">
             <h2 id="event-details-title" class="font-playfair text-3xl font-bold text-gray-700 mb-2"></h2>
             <p id="event-details-time" class="text-gray-600 mb-1"></p>
             <p id="event-details-status" class="text-sm font-semibold mb-6"></p>
             <div id="event-details-actions" class="pt-4 flex flex-col sm:flex-row gap-4"></div>
             <button type="button" id="close-details-btn" class="clay-button w-full p-4 text-xl text-gray-700 mt-4">Close</button>
        </div>
    </div>
    <div id="alert-modal" class="hidden fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="clay-card w-full max-w-sm p-6 sm:p-8 text-center">
            <h2 id="alert-title" class="font-playfair text-2xl font-bold text-gray-700 mb-4"></h2>
            <p id="alert-message" class="text-gray-600 mb-6"></p>
            <button type="button" id="alert-ok-btn" class="clay-button clay-button-primary w-full p-3 text-lg text-gray-800">OK</button>
        </div>
    </div>
</div>
