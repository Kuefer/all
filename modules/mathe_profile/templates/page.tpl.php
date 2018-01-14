<div class="page-profile">
<?php
  echo !empty($variables['message'])? $variables['message']: '';

  echo drupal_render($variables['info']);
  echo drupal_render($variables['chart']);
  #echo drupal_render($variables['edit']);
  echo drupal_render($variables['password']);
?>
</div>
