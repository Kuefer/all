  <body>

   <?php
    if (!user_is_logged_in()
        && request_path() !== 'user'
        && request_path() !== 'user/login'
        && request_path() !== 'user/password'
      ) {
        drupal_goto('user/login');
      }

    if (!user_is_logged_in()):
      global $user;
    ?>

  <header>
    <div class="container">
      <h4 id="logo"><a href="/">Mathe-Nachhilfe</a></h4>
    </div>
  </header>

  <main>
    <div class="welcome">
     <?php print $messages; ?>
      <?php if(!empty($title)) print '<h3>' . $title . '</h3>'; ?>
      <?php print render($tabs); ?>
      <?php if(!empty($page['content'])) print render($page['content']); ?>
    </div>
  </main>

  <?php else: ?>
    <?php
      $path = explode('/',request_path());
      if ($path[0] == 'user' || drupal_is_front_page()) {
        if(!in_array(6,array_keys($user->roles))) drupal_goto('calendar');
        else drupal_goto('hour');
      }
    ?>

  <header>
    <div class="container">
      <h4 id="logo"><a href="/">Mathe-Nachhilfe</a></h4>
      <div id="account">
          <span id="name">
            <a href="#" title="Mathe-Nachhilfe account: <?php print $user->name . ' ' . $user->mail; ?>"><?php print $user->name; ?></a>
          </span>
          <ul class="dropdown" data-toggle="false">
            <li><a href="/profile/<?php echo $user->uid; ?>" title="My Account">My Account</a></li>
            <li><a href="/user/logout" title="Sign out">Sign out</a></li>
          </ul>
      </div>
      <ul id="menu">
        <?php list($path) = explode('/', request_path()); ?>
        <?php if(!in_array(6,array_keys($user->roles))):  ?>
          <li <?php print $path == 'calendar'? 'class="active"':''; ?>><a href="/calendar">Calendar</a></li>
          <li <?php print $path == 'employees'? 'class="active"':''; ?>><a href="/employees">Employees</a></li>
          <li <?php print $path == 'hour'? 'class="active"':''; ?>><a href="/hour">Lesson hour</a></li>
          <li <?php print $path == 'students'? 'class="active"':''; ?>><a href="/students">Students</a></li>
          <li <?php print $path == 'search'? 'class="active"':''; ?>><a href="/search">Search</a></li>
        <?php else: ?>
          <li <?php print $path == 'hour'? 'class="active"':''; ?>><a href="/hour">Lesson hour</a></li>
        <?php endif;  ?>
      </ul>
    </div>
  </header>

  <main>
    <div class="container">

      <div id="page-title">
        <div id="menu-dropdown"></div>
        <?php if(!empty($title)) print '<h3>' . $title . '</h3>'; ?>
      </div>
      <?php if(!empty($page['sidebar_tabs'])) print render($page['sidebar_tabs']); ?>
      <?php print $messages; ?>

      <?php if(!empty($page['sidebar_left'])) print render($page['sidebar_left']); ?>
      <?php if(!empty($page['sidebar_right'])) print render($page['sidebar_right']); ?>

      <?php print render($tabs); ?>
      <?php if(!empty($page['content'])) print render($page['content']); ?>
      </div>
  </main>

<?php endif; ?>

  <footer>
    <div class="container">
      <?php if(!empty($page['footer'])) print render($page['footer']); ?>
      <span class="copyright"><?php print date('F Y');?> <strong>Mathe-Nachhilfe</strong>.</span>
    </div>
  </footer>
</body>
