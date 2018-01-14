<?php
function mathe_fieldset($variables) {
  $element = $variables['element'];
  element_set_attributes($element, array('id'));
  _form_set_class($element, array('form-wrapper'));

  $output = '<fieldset' . drupal_attributes($element['#attributes']) . '>';
  if (!empty($element['#title'])) {
    // Always wrap fieldset legends in a SPAN for CSS positioning.
    $output .= '<legend><span>' . $element['#title'] . '</span>';
    $output .= '<span class="fieldset-legend"></span>';
      if (!empty($element['#options'])) {
        $output .= '<div class="fieldset-options">' . $element['#options'] . '</div>';
      }
      $output .= '</legend>';
  }
  $output .= '<div class="fieldset-wrapper"><hr>';
  if (!empty($element['#description'])) {
    $output .= '<div class="fieldset-description">' . $element['#description'] . '</div>';
  }
  $output .= $element['#children'];
  if (isset($element['#value'])) {
    $output .= $element['#value'];
  }
  $output .= '</div>';
  $output .= "</fieldset>\n";
  return $output;
}

function mathe_form_alter(&$form, $form_state, $form_id) {
  if ($form_id == 'user_login' || $form_id == 'user_pass') {
    drupal_set_title(t(''));
  }
  if ($form_id == 'user_login_block') {
    drupal_set_title(t('Login'));
  }
}

/*
function mathe_theme() {
  $items = array();

  $items['user_login'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'mathe') . '/templates',
    'template' => 'user-login',
    #'preprocess functions' => array('mathe_preprocess_user_login'),
  );
  $items['user_pass'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'mathe') . '/templates',
    'template' => 'user-pass',
    #'preprocess functions' => array('mathe_preprocess_user_pass'),
  );

  return $items;
}
*/
