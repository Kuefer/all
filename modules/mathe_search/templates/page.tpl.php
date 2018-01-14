<div class="page-search">
<?php
  echo !empty($variables['message'])? $variables['message']: '';

  echo drupal_render($variables['search']);
  echo drupal_render($variables['advanced']);
  echo drupal_render($variables['result']);
?>
</div>
