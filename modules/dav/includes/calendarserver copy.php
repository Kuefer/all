<?php

/**
 * @file
 * SabreDAV integration
 *
 * @name SabreDAV
 * @author admin
 */

/**
 *
 */
function _sabredav_calendarserver() {
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
    new Sabre_DAVACL_PrincipalCollection($principalBackend),
    new Sabre_CalDAV_CalendarRootNode($principalBackend, $calendarBackend)
  );

  // The object tree needs in turn to be passed to the server class
  $server = new Sabre_DAV_Server($tree);
  //$server->setBaseUri('/Tests/SabreDAV'); // if its in some kind of home directory
  $server->setBaseUri($baseUri);

  // Authentication plugin
  $server->addPlugin(new Sabre_DAV_Auth_Plugin($authBackend,'SabreDAV'));
  $server->addPlugin(new Sabre_CalDAV_Plugin());
  $server->addPlugin(new Sabre_DAVACL_Plugin());
  $server->addPlugin(new Sabre_DAV_Browser_Plugin());

  // And off we go!
  $server->exec();
  exit();
}

class Drupal_Sabre_DAVACL_PrincipalBackend_PDO extends Sabre_DAVACL_PrincipalBackend_PDO {

  /**
  * Sets up the backend.
  * 
  * @param PDO $pdo
  * @param string $tableName 
  */
  public function __construct(PDO $pdo, $tableName = 'sabredav_principals', $groupMembersTableName = 'sabredav_groupmembers') {
    $this->pdo = $pdo;
    $this->tableName = $tableName;
    $this->groupMembersTableName = $groupMembersTableName;
  } 
}

/**
 * This is an authentication backend that uses a file to manage passwords.
 *
 * The backend file must conform to Apache's htdigest format
 * 
 * @package Sabre
 * @subpackage DAV
 * @copyright Copyright (C) 2007-2011 Rooftop Solutions. All rights reserved.
 * @author Evert Pot (http://www.rooftopsolutions.nl/) 
 * @license http://code.google.com/p/sabredav/wiki/License Modified BSD License
 */
class Drupal_Sabre_DAV_Auth_Backend_PDO extends Sabre_DAV_Auth_Backend_PDO {

  /**
   * Returns the digest hash for a user. 
   * 
   * @param string $realm 
   * @param string $username 
   * @return string|null 
   */
  public function getDigestHash($realm,$username) {
    $sql = "SELECT d.digesta1
      FROM {sabredav_user_digesta1} d
      LEFT JOIN {$this->tableName} u
      ON u.uid = d.uid
      WHERE u.name = :name";
    $result = db_query($sql, array(':name' => $username))->fetchField();

    return (count($result) ? $result : FALSE);
  }
}


/**
 * PDO CardDAV backend
 *
 * This CardDAV backend uses PDO to store addressbooks
 * 
 * @package Sabre
 * @subpackage CardDAV
 * @copyright Copyright (C) 2007-2011 Rooftop Solutions. All rights reserved.
 * @author Evert Pot (http://www.rooftopsolutions.nl/) 
 * @license http://code.google.com/p/sabredav/wiki/License Modified BSD License
 */
class Drupal_Sabre_CalDAV_Backend_PDO extends Sabre_CalDAV_Backend_PDO {

  /**
   * Sets up the object 
   * 
   * @param PDO $pdo 
   */
  public function __construct(PDO $pdo) {
    $this->pdo = $pdo;
    $this->calendarTableName = 'sabredav_calendars';
    $this->calendarObjectTableName = 'sabredav_calendar_events';
  }

  /**
   * Creates a new calendar object. 
   * 
   * @param string $calendarId 
   * @param string $objectUri 
   * @param string $calendarData 
   * @return void
   */
  public function createCalendarObject($calendar_id, $object_uri, $calendar_data) {

    $sabredav_calendar_event = new stdClass;
    sabredav_calendar_event_prepare($sabredav_calendar_event, $calendar_id, $object_uri, $calendar_data);
    // Save the event.
    sabredav_calendar_event_save($sabredav_calendar_event);

    $stmt = $this->pdo->prepare('UPDATE `'.$this->calendarTableName.'` SET ctag = ctag + 1 WHERE id = ?');
    $stmt->execute(array($calendar_id));
  }

  /**
   * Updates an existing calendarobject, based on it's uri. 
   * 
   * @param string $calendarId 
   * @param string $objectUri 
   * @param string $calendarData 
   * @return void
   */
  public function updateCalendarObject($calendar_id, $object_uri, $calendar_data) {
    // Load the existing event by it's uri.
    $sabredav_calendar_event = sabredav_calendar_event_load_by_uri($object_uri);
    sabredav_calendar_event_prepare($sabredav_calendar_event, $calendar_id, $object_uri, $calendar_data);
    // Save the event.
    sabredav_calendar_event_save($sabredav_calendar_event);

    $stmt = $this->pdo->prepare('UPDATE `'.$this->calendarTableName.'` SET ctag = ctag + 1 WHERE id = ?');
    $stmt->execute(array($calendar_id));
  }

  /**
   * Deletes an existing calendar object. 
   * 
   * @param string $calendarId 
   * @param string $objectUri 
   * @return void
   */
  public function deleteCalendarObject($calendar_id, $object_uri) {

    // Load the existing event by it's uri.
    $sabredav_calendar_event = sabredav_calendar_event_load_by_uri($object_uri);
    // Delete the event.
    sabredav_calendar_event_delete($sabredav_calendar_event);

    $stmt = $this->pdo->prepare('UPDATE `'. $this->calendarTableName .'` SET ctag = ctag + 1 WHERE id = ?');
    $stmt->execute(array($calendar_id));
  }
}
