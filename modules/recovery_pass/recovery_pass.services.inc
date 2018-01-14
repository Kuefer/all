<?php

/**
 * Implements hook_services_resources().
 */
function recovery_pass_services_resources() {
  $resources = array(
    'recovery_pass' => array(
      'operations' => array(
        'retrieve' => array(
          'help' => 'Request a new password, given a e-mail address',
          'file' => array(
            'type' => 'inc',
            'module' => 'recovery_pass',
            'name' => 'recovery_pass.resource',
          ),
          'callback' => '_recovery_pass_request_new_password',
          'args' => array(
            array(
              'name' => 'user',
              'type' => 'string',
              'description' => 'The username to request new password for.',
              'source' => array('path' => 0),
              'optional' => FALSE,
            ),
          ),
          'access callback' => '_recovery_pass_resource_access',
        ),
      ),
    ),
  );
  return $resources;
}
