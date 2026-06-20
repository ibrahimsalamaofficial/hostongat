<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../../assets/PHPMailer-master/src/Exception.php';
require __DIR__ . '/../../assets/PHPMailer-master/src/PHPMailer.php';
require __DIR__ . '/../../assets/PHPMailer-master/src/SMTP.php';

$smtpConfig = [
    'host' => 'mail.digitalasg.net',
    'username' => 'marketing@digitalasg.net',
    'password' => '0jy.sOd4qB81',
    'port' => 465,
    'encryption' => PHPMailer::ENCRYPTION_SMTPS,
];

// إيميل الأدمن
$admin_email = 'marketingreciver@digitalasg.net';

// دالة إرسال الميل
function sendEmail($to, $subject, $bodyHtml, $bodyAlt, $fromName, $smtpConfig) {
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $smtpConfig['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtpConfig['username'];
        $mail->Password   = $smtpConfig['password'];
        $mail->SMTPSecure = $smtpConfig['encryption'];
        $mail->Port       = $smtpConfig['port'];

        $mail->setFrom($smtpConfig['username'], $fromName);
        $mail->addReplyTo($smtpConfig['username'], $fromName);
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $subject;
        $mail->Body    = $bodyHtml;
        $mail->AltBody = $bodyAlt;

        $mail->send();
        return true;
    } catch (Exception $e) {
        // تسجيل الخطأ في ملف لوج
        error_log(date('Y-m-d H:i:s') . " | Failed to send to $to: {$mail->ErrorInfo}\n", 3, __DIR__ . '/errors.log');
        echo "⚠️ فشل الإرسال إلى $to: {$mail->ErrorInfo}<br>";
        return false;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $file = __DIR__ . '/subscribers.txt';
        $subscribers = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

        if (in_array(strtolower($email), array_map('strtolower', $subscribers))) {
            echo "<h2>⚠️ هذا البريد مسجل بالفعل: $email</h2>";
            exit();
        }

        file_put_contents($file, $email . PHP_EOL, FILE_APPEND | LOCK_EX);

        sendEmail(
            $email,
            'تم الاشتراك في النشرة البريدية',
            'مرحباً <b>' . htmlspecialchars($email) . '</b>،<br>شكراً لاشتراكك في نشرتنا البريدية!<br><br>📰 Digital-ASG',
            'مرحباً ' . $email . '، شكراً لاشتراكك في نشرتنا البريدية! Digital-ASG',
            'Digital-ASG',
            $smtpConfig
        );

        $subscribers = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $count = count($subscribers);
        $reportBodyHtml = '
            <h3>📩 مشترك جديد في النشرة البريدية</h3>
            <p><b>البريد الإلكتروني:</b> ' . htmlspecialchars($email) . '</p>
            <p><b>إجمالي عدد المشتركين حتى الآن:</b> ' . $count . '</p>
            <hr>
            <p style="color:gray;font-size:12px;">📅 تم التسجيل في: ' . date('Y-m-d H:i:s') . '</p>';
        
        $reportBodyAlt = "📩 مشترك جديد\nالبريد الإلكتروني: $email\nإجمالي المشتركين: $count\nتم التسجيل في: " . date('Y-m-d H:i:s');

        try {
            $mailAdmin = new PHPMailer(true);

            $mailAdmin->isSMTP();
            $mailAdmin->Host       = $smtpConfig['host'];
            $mailAdmin->SMTPAuth   = true;
            $mailAdmin->Username   = $smtpConfig['username'];
            $mailAdmin->Password   = $smtpConfig['password'];
            $mailAdmin->SMTPSecure = $smtpConfig['encryption'];
            $mailAdmin->Port       = $smtpConfig['port'];

            $mailAdmin->setFrom($smtpConfig['username'], 'Digital-ASG Report');
            $mailAdmin->addAddress($admin_email);
            $mailAdmin->addReplyTo($smtpConfig['username'], 'Digital-ASG');
            $mailAdmin->CharSet = 'UTF-8';

            $file = __DIR__ . '/subscribers.txt';
            if (file_exists($file)) {
                $mailAdmin->addAttachment($file, 'subscribers.txt');
            }

            $mailAdmin->isHTML(true);
            $mailAdmin->Subject = '📊 تقرير الاشتراكات - وصلنا إلى ' . $count . ' مشترك';
            $mailAdmin->Body    = $reportBodyHtml;
            $mailAdmin->AltBody = $reportBodyAlt;

            $mailAdmin->send();
        } catch (Exception $e) {
            error_log(date('Y-m-d H:i:s') . " | Failed to send admin report: {$mailAdmin->ErrorInfo}\n", 3, __DIR__ . '/errors.log');
            echo "⚠️ فشل إرسال تقرير الأدمن: {$mailAdmin->ErrorInfo}<br>";
        }

        header("Location: smm.html#trends?success=1");
        exit();

    } else {
        echo "<h2>❌ من فضلك أدخل بريد إلكتروني صحيح</h2>";
    }
} else {
    header("Location: ../../../../index.html");
    exit();
}
?>
