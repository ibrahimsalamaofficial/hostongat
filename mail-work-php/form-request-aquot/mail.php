<?php
// mail.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1) Collect & sanitize input (بدون FILTER_SANITIZE_STRING لأنه Deprecated)
    $name    = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $company = htmlspecialchars(trim($_POST['company'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $phone   = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    // 2) Check required fields
    if (!$name || !$company || !$email || !$phone || !$message) {
        die('Please fill in all required fields with valid data.');
    }

    // 3) Build email
    $to      = 'himaslama00@gmail.com';  // ← حط هنا إيميلك أو إيميلات المستلمين
    $subject = 'New Request Form Hostongat';
    $body    = "You have a new message from Hostongat form:\r\n\r\n" .
            "Name: {$name}\r\n" .
            "Company: {$company}\r\n" .
            "Email: {$email}\r\n" .
            "Phone: {$phone}\r\n\r\n" .
            "Message:\r\n{$message}\r\n";

    // 4) Headers (أضفت Content-Type)
    $headers  = "From: {$name} <{$email}>\r\n";
    $headers .= "Reply-To: {$email}\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 5) Send
    if (mail($to, $subject, $body, $headers)) {
        echo    "<script>
                    alert('Your message has been sent successfully!');
                    window.location = document.referrer;
                </script>";
        exit;
    } else {
        echo 'Sorry, something went wrong. Please try again later.';
    }

} else {
    // block non-POST access
    header('HTTP/1.1 405 Method Not Allowed');
    exit;
}
