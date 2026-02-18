 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WeRent | Register</title>

    <link rel="stylesheet" href="./css/index.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">

    <style>
        :root { 
            --white: #ffffff;
            --white-soft: #f8fbff;
            --line: #d8e4f5;
            --ink: #10233f;
            --ink-soft: #5f738f;
            --blue: #1e4f91;
            --blue-soft: #e9f1ff; 
            --red: #d8142d;
            --red-soft: #ffedf1; 
            --shadow: 0 16px 34px rgba(12, 33, 66, 0.1);
        } 

        html,
        body {
            min-height: 100%;
        }

        body {
            margin: 0;
            font-family: Manrope, sans-serif;
            color: var(--ink);
            background:
                radial-gradient(circle at 90% 5%, rgba(30, 79, 145, 0.08), transparent 33%),
                radial-gradient(circle at 4% 10%, rgba(216, 20, 45, 0.08), transparent 30%),
                var(--white-soft);
            overflow: auto !important;
        }

        .page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1.05rem;
        }

        .topbar {
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: 16px;
            padding: 0.8rem 0.95rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 0.7rem;
            box-shadow: 0 8px 20px rgba(18, 53, 104, 0.06);
        }

        .brand {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
        }
 
        .logo-panel {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            background: linear-gradient(140deg, #11325f, #1e4f91);
            border: 1px solid #214f8e;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 18px rgba(21, 60, 116, 0.28);
        }

        .logo-panel img {
            width: 44px;
            height: 44px;
        }

        .brand-text {
            font-family: Syne, sans-serif;
            font-size: 1.06rem;
            font-weight: 700;
            letter-spacing: 0.01em;
            color: #0f2f58;
        }

        .brand-text small {
            display: block;
            margin-top: 0.08rem;
            font-family: Manrope, sans-serif;
            font-size: 0.71rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--ink-soft);
        }

        .topbar-meta {
            margin-left: auto;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            font-size: 0.75rem;
            color: #6b7f9b;
        }

        .topbar-meta span {
            padding: 0.25rem 0.6rem;
            border-radius: 999px;
            border: 1px solid #d6e2f5;
            background: #f5f9ff;
        }

        .layout {
            margin-top: 0.9rem;
            display: grid;
            gap: 0.95rem;
            grid-template-columns: minmax(300px, 1fr);
        }

        .left {
            display: grid;
            gap: 0.9rem;
        }

        .panel {
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: 18px;
            box-shadow: var(--shadow);
        }

        .hero {
            padding: 1.25rem;
            display: grid;
            gap: 1rem;
            grid-template-columns: minmax(0, 1fr);
        }

        .hero .tag {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-size: 0.68rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #c0142c;
            font-family: Syne, sans-serif;
        }

        .hero .tag::before {
            content: "";
            width: 24px;
            height: 2px;
            border-radius: 99px;
            background: linear-gradient(to right, var(--red), transparent);
        }

        .hero h1 {
            margin: 0.5rem 0 0;
            font-family: Syne, sans-serif;
            font-size: clamp(1.5rem, 2.6vw, 2.35rem);
            line-height: 1.08;
            letter-spacing: -0.02em;
            color: #0f315c;
        }

        .hero p {
            margin: 0.8rem 0 0;
            font-size: 0.94rem;
            line-height: 1.65;
            color: var(--ink-soft);
            max-width: 58ch;
        }

        .hero-actions {
            margin-top: 0.95rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.55rem;
        }

        .btn {
            padding: 0.62rem 0.95rem;
            border-radius: 10px;
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            border: 1px solid transparent;
            transition: 0.22s ease;
        }

        .btn-primary {
            background: linear-gradient(110deg, #d8142d, #f02f49);
            color: #fff;
            box-shadow: 0 11px 20px rgba(216, 20, 45, 0.26);
        }

        .btn-primary:hover {
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: #eff5ff;
            color: #184278;
            border-color: #c8d9f3;
        }

        .btn-secondary:hover {
            background: #e6f0ff;
        }

        .hero-visual {
            border: 1px solid #d4e1f4;
            border-radius: 14px;
            overflow: hidden;
            min-height: 230px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
        }

        .hero-visual img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .details {
            padding: 1rem 1.05rem 1.1rem;
        }

        .section-title {
            margin: 0;
            font-family: Syne, sans-serif;
            font-size: 1rem;
            color: #123a6b;
            letter-spacing: -0.01em;
        }

        .section-sub {
            margin: 0.35rem 0 0;
            font-size: 0.82rem;
            color: var(--ink-soft);
        }

        .stats-grid {
            margin-top: 0.7rem;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.55rem;
        }

        .stats-item {
            border: 1px solid #d6e2f4;
            border-radius: 10px;
            background: #fbfdff;
            padding: 0.62rem 0.68rem;
            font-size: 0.76rem;
            color: #4f6480;
        }

        .stats-item strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 1rem;
            color: #102f59;
            margin-bottom: 0.15rem;
        }

        .service-grid {
            margin-top: 0.8rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.55rem;
        }

        .service {
            border: 1px solid #d9e5f7;
            border-radius: 10px;
            background: #ffffff;
            padding: 0.67rem 0.72rem;
            font-size: 0.8rem;
            color: #4c6281;
        }

        .service strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 0.9rem;
            color: #123a6d;
            margin-bottom: 0.14rem;
        }

        .gallery {
            margin-top: 0.8rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.58rem;
        }

        .gallery-item {
            border: 1px solid #d7e4f6;
            border-radius: 11px;
            overflow: hidden;
            background: #fff;
        }

        .gallery-item img {
            width: 100%;
            height: 140px;
            object-fit: cover;
            display: block;
        }

        .showcase {
            margin-top: 0.85rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.6rem;
        }

        .showcase-card {
            display: grid;
            gap: 0.5rem;
            border: 1px solid #d7e3f6;
            border-radius: 12px;
            background: #ffffff;
            overflow: hidden;
        }

        .showcase-card img {
            width: 100%;
            height: 170px;
            object-fit: cover;
            display: block;
        }

        .showcase-card .copy {
            padding: 0.6rem 0.7rem 0.75rem;
            font-size: 0.78rem;
            color: #536a88;
        }

        .showcase-card .copy strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 0.92rem;
            color: #123a6d;
            margin-bottom: 0.2rem;
        }

        .gallery-item p {
            margin: 0;
            padding: 0.5rem 0.62rem;
            font-size: 0.74rem;
            color: #526a88;
            background: #fbfdff;
        }

        .default-note {
            margin-top: 0.68rem;
            border: 1px dashed #df6174;
            background: var(--red-soft);
            border-radius: 10px;
            padding: 0.62rem 0.68rem;
            color: #9e1128;
            font-size: 0.76rem;
        }

        .form-card {
            padding: 1.06rem;
            align-self: start;
            position: relative;
        }

        .form-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.6rem;
        }

        .form-head h2 {
            margin: 0;
            font-family: Syne, sans-serif;
            font-size: 1.04rem;
            letter-spacing: -0.01em;
            color: #10345f;
        }

        .form-head span {
            font-size: 0.7rem;
            color: #be1129;
            background: #ffeef2;
            border: 1px solid #f7c8d2;
            border-radius: 999px;
            padding: 0.2rem 0.55rem;
        }

        .form-sub {
            margin: 0.42rem 0 0;
            font-size: 0.79rem;
            color: var(--ink-soft);
            line-height: 1.55;
        }

        .form-grid {
            margin-top: 0.76rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.56rem;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 0.24rem;
        }

        .span-2 {
            grid-column: span 1;
        }

        .field label {
            font-family: Syne, sans-serif;
            font-size: 0.64rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4f6b8f;
        }

        .control {
            width: 100%;
            border: 1px solid #cfddf1;
            border-radius: 9px;
            background: #fdfefe;
            color: #12335f;
            padding: 0.63rem 0.67rem;
            font-size: 0.83rem;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .control::placeholder {
            color: #8da4c2;
        }

        .control:focus {
            outline: none;
            border-color: #d8142d;
            box-shadow: 0 0 0 3px rgba(216, 20, 45, 0.14);
        }

        select.control option {
            color: #10233f;
        }

        .submit-btn {
            width: 100%;
            margin-top: 0.7rem;
            border: 0;
            border-radius: 10px;
            background: linear-gradient(110deg, #d8142d, #f02f49);
            color: #fff;
            font-family: Syne, sans-serif;
            font-size: 0.78rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-weight: 700;
            padding: 0.73rem 0.9rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.54rem;
            box-shadow: 0 12px 22px rgba(216, 20, 45, 0.3);
            transition: 0.22s ease;
        }

        .submit-btn:hover {
            transform: translateY(-1px);
        }

        .foot-note {
            margin-top: 0.52rem;
            text-align: center;
            font-size: 0.73rem;
            color: #6582a3;
        }

        .foot-note a {
            color: #114177;
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .control-error {
            color: #be1129 !important;
            font-size: 0.71rem;
        }

        @media (min-width: 900px) {
            .layout {
                grid-template-columns: 1fr minmax(360px, 400px);
                align-items: start;
            }

            .hero {
                grid-template-columns: 1.07fr 0.93fr;
                align-items: stretch;
            }

            .service-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .gallery {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }

            .showcase {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .form-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .span-2 {
                grid-column: span 2;
            }

            .form-card {
                position: sticky;
                top: 0.95rem;
            }
        }

        @media (max-width: 580px) {
            .topbar {
                flex-direction: column;
                align-items: flex-start;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <header class="topbar animate__animated animate__fadeInDown">
            <a href="./register.php" class="brand">
                <div class="logo-panel">
                    <img src="./images/icon.png" alt="WeRent logo">
                </div>
                <span class="brand-text">
                    WERENT
                    <small>Property Management Software</small>
                </span>
            </a>
            <div class="topbar-meta">
                <span>Public Inquiry Portal</span>
                <span>Residential + Commercial</span>
            </div>
        </header>

        <main class="layout">
            <section class="left">
                <article class="panel hero animate__animated animate__fadeIn">
                    <div>
                        <span class="tag">Real Estate Operations</span>
                        <h1>Smart operations for property sales and management.</h1>
                        <p>
                            Avatar Homes helps teams manage unit listings, occupancy, client tracking, and property
                            transactions from one modern platform. This public page is your default inquiry channel
                            to start registration.
                        </p>
                        <div class="hero-actions"> 
                            <a href="#signup-form" class="btn btn-primary">Start Registration</a>
                            <a href="#details" class="btn btn-secondary">View Details</a>
                        </div>
                    </div>
                    <div class="hero-visual">
                        <img src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80" alt="Modern residential buildings">
                    </div>
                </article>

                <article id="details" class="panel details animate__animated animate__fadeInUp">
                    <h2 class="section-title">Built for property teams that need speed and structure</h2>
                    <p class="section-sub">
                        A clean workflow from inquiry to active client lifecycle, with practical tools for daily operations.
                    </p>

                    <div class="stats-grid">
                        <div class="stats-item">
                            <strong>Single Dashboard</strong>
                            Manage property and client activity in one place.
                        </div>
                        <div class="stats-item">
                            <strong>Accurate Records</strong>
                            Keep client and dependent profiles organized.
                        </div>
                        <div class="stats-item">
                            <strong>Quicker Follow-Up</strong>
                            Capture complete inquiry details from first contact.
                        </div>
                        <div class="stats-item">
                            <strong>Ops Visibility</strong>
                            Understand pipeline, renewals, and active occupancy.
                        </div>
                    </div>

                    <div class="service-grid">
                        <article class="service">
                            <strong>Property Listing Control</strong>
                            Organize available units and property metadata clearly.
                        </article>
                        <article class="service">
                            <strong>Client Intake</strong>
                            Register details with validation and clean records.
                        </article>
                        <article class="service">
                            <strong>Documented Workflows</strong>
                            Support follow-up actions with trackable information.
                        </article>
                        <article class="service">
                            <strong>Scalable Process</strong>
                            Suitable for growing portfolios and active teams.
                        </article>
                    </div>

                    <div class="gallery">
                        <figure class="gallery-item">
                            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80" alt="Detached house property">
                            <p>Residential property portfolio</p>
                        </figure>
                        <figure class="gallery-item">
                            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80" alt="Commercial building tower">
                            <p>Commercial and office properties</p>
                        </figure>
                        <figure class="gallery-item">
                            <img src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=900&q=80" alt="Urban apartment blocks">
                            <p>Multi-unit apartment operations</p>
                        </figure>
                    </div>

                    <div class="showcase">
                        <article class="showcase-card">
                            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80" alt="Modern living room interior">
                            <div class="copy">
                                <strong>Quality Accommodation</strong>
                                Showcasing well-managed living spaces with clear client onboarding.
                            </div>
                        </article>
                        <article class="showcase-card">
                            <img src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80" alt="City skyline real estate">
                            <div class="copy">
                                <strong>Prime Locations</strong>
                                Residential and commercial inventory across high-demand areas.
                            </div>
                        </article>
                        <article class="showcase-card">
                            <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80" alt="Apartment corridor">
                            <div class="copy">
                                <strong>Organized Occupancy</strong>
                                Structured unit assignment and verified client records.
                            </div>
                        </article>
                        <article class="showcase-card">
                            <img src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=900&q=80" alt="Contemporary home exterior">
                            <div class="copy">
                                <strong>Live Listings</strong>
                                Current availability and real-time property inquiries.
                            </div>
                        </article>
                    </div>

                    <p class="default-note">
                        Default sign-up point: complete the inquiry form to register interest as a client or dependent.
                    </p>
                </article>
            </section>

            <aside id="signup-form" class="panel form-card animate__animated animate__fadeInRight">
                <div class="form-head">
                    <h2>Inquiry Sign Up</h2>
                    <span>Public Form</span>
                </div>
                <p class="form-sub">Submit your details and our property team will follow up.</p>

                <form id="external-inquiry-form" autocomplete="off">
                    <div class="form-grid">
                        <div class="field">
                            <label for="firstname">First Name</label>
                            <input type="text" name="firstname" id="firstname" class="control" maxlength="60" placeholder="Ada">
                        </div>
                        <div class="field">
                            <label for="lastname">Last Name</label>
                            <input type="text" name="lastname" id="lastname" class="control" maxlength="60" placeholder="Okafor">
                        </div>
                        <div class="field span-2">
                            <label for="othernames">Other Names</label>
                            <input type="text" name="othernames" id="othernames" class="control" maxlength="80" placeholder="Middle name(s)">
                        </div>
                        <div class="field">
                            <label for="email">Email</label>
                            <input type="email" name="email" id="email" class="control" maxlength="120" placeholder="name@example.com">
                        </div>
                        <div class="field">
                            <label for="phone">Phone</label>
                            <input type="tel" name="phone" id="phone" class="control" maxlength="20" placeholder="+234 801 234 5678">
                        </div>
                        <div class="field span-2">
                            <label for="address">Address</label>
                            <input type="text" name="address" id="address" class="control" maxlength="200" placeholder="Street, city, state">
                        </div>
                        <div class="field span-2">
                            <label for="inquirytype">Your Request</label>
                            <select name="inquirytype" id="inquirytype" class="control">
                                <option value="">Select request</option> 
                                <option value="BUY_PROPERTY">I am interested in buying a property</option>
                                <option value="GENERAL_INQUIRY">I am just making an inquiry</option>
                            </select>
                        </div>
                        <div class="field span-2">
                            <label for="moredetails">More Details</label>
                            <textarea name="moredetails" id="moredetails" class="control" rows="3" placeholder="Share any details about the property, location, or budget."></textarea>
                        </div>
                    </div>

                    <input type="hidden" name="role" value="STAFF">
                    <button type="button" id="submit" class="submit-btn">
                        <span class="btnloader" style="display:none;"></span>
                        <span>Submit Registration</span>
                    </button>
                    <p class="foot-note">Internal users can <a href="./login">sign in here</a>.</p>
                </form>
            </aside>
        </main>
    </div>

    <script src="./js/util.js"></script>
    <script src="./js/register.js"></script>
</body>
</html>
