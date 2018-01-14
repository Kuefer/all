<?php

function _recovery_pass_request_new_password($user = NULL) {
  global $language;
  $user = trim($user);
  $user = user_load_by_name($user);

  // Generate random password.
  $random_password = user_password();
  // Store Old Hash Password Temporarily.
  if (!_recovery_pass_store_old_pass($user)) {
    watchdog('recovery_pass', 'Error saving old password for user @id', array('@id' => $user->uid), WATCHDOG_NOTICE, 'link');
  }
  // Save new password.
  user_save($user, array('pass' => $random_password), 'account');

  // Retrive email body and subject.
  $message = _recovery_pass_mail_text('email_text', $language, TRUE, $user);
  if ($message) {
    // Replace [user_new_password] placeholder with new password.
    $message = str_replace("[user_new_password]", $random_password, $message);
  }
  $subject = _recovery_pass_mail_text('email_subject', $language, TRUE, $user);
  if (module_exists("htmlmail")) {
    // For html mail convert new lines to br.
    $message = nl2br($message);
  }
  $params = array(
    'body' => $message,
    'subject' => $subject,
  );
  $to = $user->mail;
  $from = variable_get('site_mail');
  if (drupal_mail('recovery_pass', 'recovery_pass', $to, language_default(), $params, $from, TRUE)) {
    return TRUE;
  }
  else {
    return services_error(t("Error Sending Recovery Mail. Please contact site administrator."), 406);
  }
}

function _recovery_pass_resource_access() {
  return TRUE;
}
