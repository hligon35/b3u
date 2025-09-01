<?php
// Enable CORS for the website domain
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body']);
    exit;
}

// Honeypot: if filled, treat as success but do nothing
if (!empty($input['company'])) {
    echo json_encode(['success' => true, 'message' => 'Thank you!']);
    exit;
}

// Validate required fields
$required_fields = ['name', 'email', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input
$name = filter_var($input['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$subject = filter_var($input['subject'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$message = filter_var($input['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

// Email configuration
$to = 'BreeCharles@b3unstoppable.com';
$email_subject = "B3U Message!!!";

// Email body
$email_body = "
Hello B3U Podcast Team,

You have received a new message from your website contact form.

Contact Information:
- Name: $name
- Email: $email
- Subject: $subject

Message:
$message

---
This message was sent from the B3U Podcast website contact form.
Time: " . date('Y-m-d H:i:s') . "
";

// Email headers
$headers = [
    'From: B3U Website <noreply@b3unstoppable.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
if (mail($to, $email_subject, $email_body, implode("\r\n", $headers))) {
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>
