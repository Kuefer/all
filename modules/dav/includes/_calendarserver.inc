<?php

function _dav_calendarserver() {

  #header('HTTP/1.1 401 Unauthorized', true, 401);
  #exit;
  
  // Make sure this setting is turned on and reflect the root url for your WebDAV server.
  // This can be for example the root / or a complete path to your server script
  $baseUri = @url('dav', array('language' => FALSE)) . '/';

  // Database
  $pdo = Database::getConnection();
  $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

  // Mapping PHP errors to exceptions
  function exception_error_handler($errno, $errstr, $errfile, $errline ) {
      throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
  set_error_handler("exception_error_handler");

  // Backends
  $authBackend = new Drupal_Sabre_DAV_Auth_Backend_PDO($pdo);
  $principalBackend = new Drupal_Sabre_DAVACL_PrincipalBackend_PDO($pdo);
  $calendarBackend = new Drupal_Sabre_CalDAV_Backend_PDO($pdo);

  // Directory tree
  $tree = array(
    new Sabre\DAVACL\PrincipalCollection($principalBackend),
    new Sabre\CalDAV\CalendarRoot($principalBackend, $calendarBackend)
  );

  // The object tree needs in turn to be passed to the server class
  $server = new Sabre\DAV\Server($tree);
  //$server->setBaseUri('/Tests/SabreDAV'); // if its in some kind of home directory
  $server->setBaseUri($baseUri);

  // Authentication plugin
  $server->addPlugin(new Sabre\DAV\Auth\Plugin($authBackend));
  $server->addPlugin(new Sabre\CalDAV\Plugin());
  $server->addPlugin(new Sabre\DAVACL\Plugin());
  $server->addPlugin(new Sabre\DAV\Browser\Plugin());

  // And off we go!
  $server->exec();
  exit();
}

