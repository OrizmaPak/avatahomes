 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avata Homes | Inquiry</title>

    <link rel="stylesheet" href="./css/index.css"> 
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css">

    <style>
        :root {
            --white: #ffffff;
            --white-soft: #fffdf7;
            --line: #eadcb7;
            --ink: #3f2f15;
            --ink-soft: #7a6640; 
            --blue: #b88a1c;
            --blue-soft: #fff5dc;
            --red: #a97a16;
            --red-soft: #fff2d4;
            --shadow: 0 16px 34px rgba(116, 83, 13, 0.14);
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
                radial-gradient(circle at 90% 5%, rgba(184, 138, 28, 0.12), transparent 33%),
                radial-gradient(circle at 4% 10%, rgba(169, 122, 22, 0.1), transparent 30%),
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
            box-shadow: 0 8px 20px rgba(116, 83, 13, 0.1);
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
            background: linear-gradient(140deg, #e2be63, #b88a1c);
            border: 1px solid #b88a1c;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 18px rgba(116, 83, 13, 0.28);
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
            color: #7a560e;
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
            color: #8a7242;
        }

        .topbar-meta span {
            padding: 0.25rem 0.6rem;
            border-radius: 999px;
            border: 1px solid #ecdcb4;
            background: #fff8e6;
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
            color: #8e630e;
            font-family: Syne, sans-serif;
        }

        .hero .tag::before {
            content: "";
            width: 24px;
            height: 2px;
            border-radius: 99px;
            background: linear-gradient(to right, #b88a1c, transparent);
        }

        .hero h1 {
            margin: 0.5rem 0 0;
            font-family: Syne, sans-serif;
            font-size: clamp(1.5rem, 2.6vw, 2.35rem);
            line-height: 1.08;
            letter-spacing: -0.02em;
            color: #5f430f;
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
            background: linear-gradient(110deg, #d7b255, #b88a1c);
            color: #fff;
            box-shadow: 0 11px 20px rgba(116, 83, 13, 0.26);
        }

        .btn-primary:hover {
            transform: translateY(-1px);
        }

        .btn-secondary {
            background: #fff6de;
            color: #6e4f12;
            border-color: #e8d3a1;
        }

        .btn-secondary:hover {
            background: #fff1cf;
        }

        .hero-visual {
            border: 1px solid #e6d5a8;
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
            color: #6a4b0f;
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
            border: 1px solid #eadcb7;
            border-radius: 10px;
            background: #fbfdff;
            padding: 0.62rem 0.68rem;
            font-size: 0.76rem;
            color: #7a6640;
        }

        .stats-item strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 1rem;
            color: #5f430f;
            margin-bottom: 0.15rem;
        }

        .service-grid {
            margin-top: 0.8rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.55rem;
        }

        .service {
            border: 1px solid #eadcb7;
            border-radius: 10px;
            background: #ffffff;
            padding: 0.67rem 0.72rem;
            font-size: 0.8rem;
            color: #7a6640;
        }

        .service strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 0.9rem;
            color: #6a4b0f;
            margin-bottom: 0.14rem;
        }

        .gallery {
            margin-top: 0.8rem;
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.58rem;
        }

        .gallery-item {
            border: 1px solid #eadcb7;
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
            border: 1px solid #eadcb7;
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
            color: #7a6640;
        }

        .showcase-card .copy strong {
            display: block;
            font-family: Syne, sans-serif;
            font-size: 0.92rem;
            color: #6a4b0f;
            margin-bottom: 0.2rem;
        }

        .gallery-item p {
            margin: 0;
            padding: 0.5rem 0.62rem;
            font-size: 0.74rem;
            color: #7a6640;
            background: #fbfdff;
        }

        .default-note {
            margin-top: 0.68rem;
            border: 1px dashed #c79b33;
            background: var(--red-soft);
            border-radius: 10px;
            padding: 0.62rem 0.68rem;
            color: #7a560e;
            font-size: 0.76rem;
        }

        .form-card {
            padding: 0;
            align-self: start;
            position: relative;
            overflow: hidden;
            background:
                linear-gradient(180deg, rgba(255, 248, 230, 0.92), rgba(255, 255, 255, 0.98)),
                #fff;
        }

        .form-card::before {
            content: "";
            position: absolute;
            inset: 0 0 auto 0;
            height: 5px;
            background: linear-gradient(90deg, #d7b255, #b88a1c, #8f6510);
        }

        .form-shell {
            padding: 1.15rem;
            display: grid;
            gap: 1rem;
        }

        .form-card *,
        .form-card *::before,
        .form-card *::after {
            box-sizing: border-box;
        }

        .form-highlight {
            display: grid;
            gap: 0.75rem;
            padding: 0.9rem 0.95rem;
            border: 1px solid #ecdcb4;
            border-radius: 14px;
            background: linear-gradient(135deg, rgba(255, 246, 222, 0.96), rgba(255, 255, 255, 0.98));
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
            color: #6a4b0f;
        }

        .form-head span {
            font-size: 0.7rem;
            color: #7a560e;
            background: #fff5dc;
            border: 1px solid #eadcb7;
            border-radius: 999px;
            padding: 0.2rem 0.55rem;
        }

        .form-sub {
            margin: 0.42rem 0 0;
            font-size: 0.79rem;
            color: var(--ink-soft);
            line-height: 1.55;
        }

        .form-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.45rem;
        }

        .form-badges span {
            padding: 0.32rem 0.6rem;
            border-radius: 999px;
            border: 1px solid #e8d3a1;
            background: rgba(255, 255, 255, 0.9);
            color: #7a560e;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .form-note {
            margin: 0;
            font-size: 0.77rem;
            line-height: 1.65;
            color: #7a6640;
        }

        .form-panel {
            display: grid;
            gap: 0.85rem;
            padding: 0.95rem;
            border: 1px solid #eadcb7;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }

        .form-section {
            display: grid;
            gap: 0.7rem;
        }

        .form-section-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.6rem;
            padding-bottom: 0.55rem;
            border-bottom: 1px solid rgba(234, 220, 183, 0.85);
        }

        .form-section-title strong {
            font-family: Syne, sans-serif;
            font-size: 0.86rem;
            color: #6a4b0f;
            letter-spacing: -0.01em;
        }

        .form-section-title span {
            font-size: 0.68rem;
            color: #8a7242;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .form-grid {
            display: grid;
            grid-template-columns: repeat(1, minmax(0, 1fr));
            gap: 0.72rem;
            align-items: start;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 0.34rem;
            width: 100%;
            min-width: 0;
        }

        .span-2 {
            grid-column: span 1;
        }

        .field label {
            font-family: Syne, sans-serif;
            font-size: 0.64rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #7a6640;
        }

        .control {
            display: block;
            width: 100%;
            min-width: 0;
            border: 1px solid #eadcb7;
            border-radius: 11px;
            background: #fffef9;
            color: #5f430f;
            padding: 0.78rem 0.8rem;
            min-height: 48px;
            font-size: 0.83rem;
            line-height: 1.35;
            -webkit-appearance: none;
            appearance: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        input.control,
        select.control {
            height: 48px;
        }

        select.control {
            padding-right: 2.35rem;
            background-image: linear-gradient(45deg, transparent 50%, #8f6510 50%), linear-gradient(135deg, #8f6510 50%, transparent 50%);
            background-position: calc(100% - 16px) calc(50% - 3px), calc(100% - 11px) calc(50% - 3px);
            background-size: 5px 5px, 5px 5px;
            background-repeat: no-repeat;
        }

        textarea.control {
            min-height: 120px;
            height: auto;
            resize: vertical;
        }

        .control::placeholder {
            color: #b79b66;
        }

        .control:focus {
            outline: none;
            border-color: #b88a1c;
            box-shadow: 0 0 0 3px rgba(184, 138, 28, 0.18);
        }

        select.control option {
            color: #3f2f15;
        }

        .submit-btn {
            width: 100%;
            margin-top: 0.15rem;
            border: 0;
            border-radius: 12px;
            background: linear-gradient(110deg, #d7b255, #b88a1c);
            color: #fff;
            font-family: Syne, sans-serif;
            font-size: 0.78rem;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            font-weight: 700;
            padding: 0.9rem 1rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.54rem;
            box-shadow: 0 12px 22px rgba(116, 83, 13, 0.3);
            transition: 0.22s ease;
        }

        .submit-btn:hover {
            transform: translateY(-1px);
        }

        .foot-note {
            margin-top: 0.1rem;
            text-align: center;
            font-size: 0.73rem;
            color: #8a7242;
        }

        .foot-note a {
            color: #7a560e;
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 2px;
        }

        .control-error {
            color: #8a5f0d !important;
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

            .form-shell {
                padding: 1.2rem;
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
            <a href="./index.php" class="brand">
                <div class="logo-panel">
                    <img src="./images/icon.png" alt="Avata Homes logo">
                </div>
                <span class="brand-text">
                    AVATA HOMES
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
                            Avata Homes helps teams manage unit listings, occupancy, client tracking, and property
                            transactions from one modern platform. This public page is your default inquiry channel
                            to start registration.
                        </p>
                        <div class="hero-actions"> 
                            <a href="#signup-form" class="btn btn-primary">Start Inquiry</a>
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
                <div class="form-shell">
                    <div class="form-highlight">
                        <div class="form-head">
                            <h2>Inquiry Sign Up</h2>
                            <span>Public Form</span>
                        </div>
                        <p class="form-sub">Submit your details and our property team will follow up.</p>
                        <div class="form-badges">
                            <span>Fast Review</span>
                            <span>Client Intake</span>
                            <span>Property Follow-Up</span>
                        </div>
                        <p class="form-note">
                            Complete the form once with accurate contact details. We use this information to route your
                            inquiry and match you with the right property response.
                        </p>
                    </div>

                    <form id="external-inquiry-form" class="form-panel" autocomplete="off">
                        <section class="form-section">
                            <div class="form-section-title">
                                <strong>Personal Information</strong>
                                <span>Required</span>
                            </div>
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
                            </div>
                        </section>

                        <section class="form-section">
                            <div class="form-section-title">
                                <strong>Inquiry Details</strong>
                                <span>Tell Us More</span>
                            </div>
                            <div class="form-grid">
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
                                    <textarea name="moredetails" id="moredetails" class="control" rows="5" placeholder="Share any details about the property, location, budget, preferred house type, or timeline."></textarea>
                                </div>
                            </div>
                        </section>

                        <input type="hidden" name="role" value="STAFF">
                        <button type="button" id="submit" class="submit-btn">
                            <span class="btnloader" style="display:none;"></span>
                            <span>Submit Inquiry</span>
                        </button>
                        <p class="foot-note">Internal users can <a href="./login">sign in here</a>.</p>
                    </form>
                </div>
            </aside>
        </main>
    </div>

    <script src="./js/util.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>
    <script src="./js/externalinquiry.js"></script>
</body>
</html>
