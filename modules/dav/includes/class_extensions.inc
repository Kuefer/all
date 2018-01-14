<?php
 class Drupal_Sabre_DAVACL_PrincipalBackend_PDO extends Sabre\DAVACL\PrincipalBackend\PDO {
  public function __construct(PDO $pdo, $tableName = 'dav_principals', $groupMembersTableName = 'dav_groupmembers') {
    $this->pdo = $pdo;
    $this->tableName = $tableName;
    $this->groupMembersTableName = $groupMembersTableName;
  } 
}

class Drupal_Sabre_DAV_Auth_Backend_PDO extends \Sabre\DAV\Auth\Backend\PDO {
  public function __construct(PDO $pdo) {
    $this->pdo = $pdo;
    $this->tableName = 'dav_users';
  }
}

class Drupal_Sabre_CalDAV_Backend_PDO extends Sabre\CalDAV\Backend\PDO {
  public function __construct(PDO $pdo) {
    $this->pdo = $pdo;
    $this->calendarTableName = 'dav_calendars';
    $this->calendarInstancesTableName = 'dav_calendarinstances';
    $this->calendarObjectTableName = 'dav_calendarobjects';
    $this->calendarChangesTableName = 'dav_calendarchanges';
    $this->schedulingObjectTableName = 'dav_schedulingobjects';
    $this->calendarSubscriptionsTableName = 'dav_calendarsubscriptions';
  }
}