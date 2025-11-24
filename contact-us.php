<?php
require __DIR__ . '/includes/db.php';

$errors = [
    'name' => '',
    'company' => '',
    'email' => '',
    'telephone' => '',
    'message' => '',
];

$old = [
    'name' => '',
    'company' => '',
    'email' => '',
    'telephone' => '',
    'message' => '',
    'marketing_consent' => 0,
];

$successMessage = '';
$hasErrors = [];
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
    && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $old['name'] = trim($_POST['name'] ?? '');
    $old['company'] = trim($_POST['company'] ?? '');
    $old['email'] = trim($_POST['email'] ?? '');
    $old['telephone'] = trim($_POST['telephone'] ?? '');
    $old['message'] = trim($_POST['message'] ?? '');
    $old['marketing_consent'] = isset($_POST['marketing_consent']) ? 1 : 0;

    if ($old['name'] === '') {
        $errors['name'] = 'Please enter your name.';
    }

    if ($old['email'] === '') {
        $errors['email'] = 'Please enter your email address.';
    } elseif (!filter_var($old['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address.';
    }

    if ($old['telephone'] === '') {
        $errors['telephone'] = 'Please enter your telephone number.';
    }

    if ($old['message'] === '') {
        $errors['message'] = 'Please enter your message.';
    }

    $hasErrors = array_filter($errors, static fn($value) => $value !== '');

    if (!$hasErrors) {
        $stmt = $mysqli->prepare(
            'INSERT INTO enquiries (name, company, email, telephone, message, marketing_consent)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        $stmt->bind_param(
            'sssssi',
            $old['name'],
            $old['company'],
            $old['email'],
            $old['telephone'],
            $old['message'],
            $old['marketing_consent']
        );

        $stmt->execute();
        $stmt->close();

        $successMessage = 'Your message has been sent!';

        // Reset old values on successful submission
        $old['name'] = '';
        $old['company'] = '';
        $old['email'] = '';
        $old['telephone'] = '';
        $old['message'] = '';
        $old['marketing_consent'] = 0;
    }

    // If this is an AJAX request, return JSON instead of reloading the page
    if ($isAjax) {
        header('Content-Type: application/json');

        if ($hasErrors) {
            echo json_encode([
                'success' => false,
                'errors' => $errors,
            ]);
        } else {
            echo json_encode([
                'success' => true,
                'message' => $successMessage,
            ]);
        }

        exit;
    }
}

include __DIR__ . '/includes/header.php';
?>
        <main id="contact-page">
            <div id="middle">
                <div class="hidden-xs breadcrumb-container developer-course">
                    <div class="container">
                        <ul class="breadcrumb">
                            <li><a href="index.php">Home</a></li>
                            <li>Our Offices</li>
                        </ul>
                    </div>
                </div>
                <div class="office-addresses">
                    <div class="service-list container">
                        <h1>Our Offices</h1>
                    <div class="row office-address-row">
                        <div class="col-md-4 spacer-sm">
                            <div class="block address address-cambridge">
                                <div class="image">
                                    <a href="#">
                                        <img
                                            src="assets/images/offices/cambridge.jpg"
                                            alt="Cambridge Office"
                                            class="img-full"
                                        >
                                    </a>
                                </div>
                                <div class="content">
                                    <p class="h2">
                                        <a href="#">Cambridge Office</a>
                                    </p>
                                    <p class="p">
                                        Unit 1.31,<br>
                                        St John's Innovation Centre,<br>
                                        Cowley Road, Milton,<br>
                                        Cambridge,<br>
                                        CB4 0WS
                                    </p>
                                    <div class="tel">
                                        <a href="tel:01223375772" class="h3 text-web">
                                            01223 37 57 72
                                        </a>
                                    </div>
                                    <div class="view-more">
                                        <a href="#" class="btn btn-web">View More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4 spacer-sm">
                            <div class="block address address-wymondham">
                                <div class="image">
                                    <a href="#">
                                        <img
                                            src="assets/images/offices/wymondham.jpg"
                                            alt="Wymondham Office"
                                            class="img-full"
                                        >
                                    </a>
                                </div>
                                <div class="content">
                                    <p class="h2">
                                        <a href="#">Wymondham Office</a>
                                    </p>
                                    <p class="p">
                                        Unit 15,<br>
                                        Penfold Drive,<br>
                                        Gateway 11 Business Park,<br>
                                        Wymondham, Norfolk,<br>
                                        NR18 0WZ
                                    </p>
                                    <div class="tel">
                                        <a href="tel:01603704020" class="h3 text-web">
                                            01603 70 40 20
                                        </a>
                                    </div>
                                    <div class="view-more">
                                        <a href="#" class="btn btn-web">View More</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="block address address-yarmouth">
                                <div class="image">
                                    <a href="#">
                                        <img
                                            src="assets/images/offices/yarmouth-2.jpg"
                                            alt="Great Yarmouth Office"
                                            class="img-full"
                                        >
                                    </a>
                                </div>
                                <div class="content">
                                    <p class="h2">
                                        <a href="#">Great Yarmouth Office</a>
                                    </p>
                                    <p class="p">
                                        Suite F23,<br>
                                        Beacon Innovation Centre,<br>
                                        Beacon Park, Gorleston,<br>
                                        Great Yarmouth, Norfolk,<br>
                                        NR31 7RA
                                    </p>
                                    <div class="tel">
                                        <a href="tel:01493603204" class="h3 text-web">
                                            01493 60 32 04
                                        </a>
                                    </div>
                                    <div class="view-more">
                                        <a href="#" class="btn btn-web">View More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    </div>

                <div class="section bottom container">
                <div class="row">
                    <div class="col-lg-4 col-lg-push-8">
                        <div class="cms-block" id="partial-166971">
                            <p><strong>Email us on:</strong><br></p>
                            <p><a href="mailto:sales@netmatters.com" class="h3 text-web">sales@netmatters.com</a></p>
                            <p><strong>Speak to Sales on:</strong><br></p>
                            <p><a href="tel:01603515007" class="h3 text-web">01603 515007</a></p>
                            <p><strong>Business hours:</strong></p>
                            <p><strong>Monday - Friday 07:00 - 18:00</strong></p>
                        </div>

                        <div class="cms-block" id="partial-166974">
                            <div class="container">
                                <div class="accordion out-of-hours">
                                    <div class="question out-of-hours">
                                        <h4>
                                            <a href="#" id="out-of-hours-toggle">
                                                <span class="question-text">
                                                    Out of Hours IT Support
                                                </span>
                                                <em style="font-style: normal" class="fa fa-chevron-down rotate"></em>
                                            </a>
                                        </h4>
                                        <div class="answer initiallyHidden" id="out-of-hours-content">
                                            <p>Netmatters IT are offering an Out of Hours service for Emergency and Critical tasks.</p>
                                            <p><strong>Monday - Friday 18:00 - 22:00</strong><br><strong>Saturday 08:00 - 16:00</strong><br><strong>Sunday 10:00 - 18:00</strong></p>
                                            <p>To log a critical task, you will need to call our main line number and select Option 2 to leave an Out of Hours voicemail. A technician will contact you on the number provided within 45 minutes of your call.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-8 col-lg-pull-4">
                        <form method="post" action="contact-us.php" id="contact-form" novalidate>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="name" class="required">Your Name</label>
                                        <input
                                            class="form-control"
                                            name="name"
                                            type="text"
                                            id="name"
                                            value="<?php echo htmlspecialchars($old['name'] ?? '', ENT_QUOTES); ?>"
                                        >
                                        <?php if ($errors['name'] !== ''): ?>
                                            <p class="php-error text-danger"><?php echo htmlspecialchars($errors['name'], ENT_QUOTES); ?></p>
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="company">Company Name</label>
                                        <input
                                            class="form-control"
                                            name="company"
                                            type="text"
                                            id="company"
                                            value="<?php echo htmlspecialchars($old['company'] ?? '', ENT_QUOTES); ?>"
                                        >
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="email" class="required">Your Email</label>
                                        <input
                                            class="form-control"
                                            name="email"
                                            type="email"
                                            id="email"
                                            value="<?php echo htmlspecialchars($old['email'] ?? '', ENT_QUOTES); ?>"
                                        >
                                        <?php if ($errors['email'] !== ''): ?>
                                            <p class="php-error text-danger"><?php echo htmlspecialchars($errors['email'], ENT_QUOTES); ?></p>
                                        <?php endif; ?>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="telephone" class="required">Your Telephone Number</label>
                                        <input
                                            class="form-control"
                                            name="telephone"
                                            type="text"
                                            id="telephone"
                                            value="<?php echo htmlspecialchars($old['telephone'] ?? '', ENT_QUOTES); ?>"
                                        >
                                        <?php if ($errors['telephone'] !== ''): ?>
                                            <p class="php-error text-danger"><?php echo htmlspecialchars($errors['telephone'], ENT_QUOTES); ?></p>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group message-group">
                                <label for="message" class="required">Message</label>
                                <textarea
                                    class="form-control"
                                    name="message"
                                    id="message"
                                    cols="50"
                                    rows="10"
                                ><?php echo htmlspecialchars($old['message'] ?? '', ENT_QUOTES); ?></textarea>
                                <?php if ($errors['message'] !== ''): ?>
                                    <p class="php-error text-danger"><?php echo htmlspecialchars($errors['message'], ENT_QUOTES); ?></p>
                                <?php endif; ?>
                            </div>

                            <div class="form-group consent-group">
                                <label class="pretty-checkbox">
                                    <span class="media">
                                        <span class="media-left checkbox-left">
                                            <span class="button">
                                                <span class="mdi-action-done"></span>
                                                <input
                                                    name="marketing_consent"
                                                    type="checkbox"
                                                    value="1"
                                                    <?php echo $old['marketing_consent'] ? 'checked' : ''; ?>
                                                >
                                            </span>
                                        </span>
                                        <span class="media-body">
                                            Please tick this box if you wish to receive marketing information from us.
                                            Please see our <a href="#" target="_blank">Privacy Policy</a> for more information on how we keep your data safe.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            <div class="action-block">
                                <button type="submit" class="btn btn-primary submit-btn">
                                    Send Enquiry
                                </button>
                                <small class="helper-text"><span class="text-danger">*</span> Fields Required</small>
                                <div id="form-status" aria-live="polite">
                                    <?php echo htmlspecialchars($successMessage, ENT_QUOTES); ?>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
<?php include __DIR__ . '/includes/footer.php'; ?>
