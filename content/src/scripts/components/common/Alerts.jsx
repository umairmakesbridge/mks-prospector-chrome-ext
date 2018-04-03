export const ErrorAlert = (props) => {
  if (props.message) {
              var inlineStyle = '0px';
              var fixed_position = "fixed";
              var cl = 'error';
              var title = 'Error';
              var icon  = 'mksicon-Close';
              if (props && props.type == 'caution')
              {
                  cl = 'caution';
                  title = 'Caution';
              }
              else if (props && props.type == 'Disabled')
              {
                  cl = 'caution';
                  title = option.type;
              }

              var message_box = $('<div class="messagebox messsage_alert messagebox_ ' + cl + '" style=' + inlineStyle + '><span class="alert_icon '+icon+'"></span><h3>' + title + '</h3><p>' + props.message + '</p><a class="alert_close_icon mksicon-Close"></a></div> ');
              $('.mkspanel').append(message_box);
              setTimeout('$(".messsage_alert").remove()', 4000);
              message_box.find(".alert_close_icon").click(function (e) {
                  message_box.fadeOut("fast", function () {
                      $(this).remove();
                  })
                  e.stopPropagation()
              });
          }
}

export const SuccessAlert = (props) => {
            var message_box = $('<div class="global_messages messagebox success"><span class="alert_icon mksicon-Check"></span><h3>Success</h3><p>'+props.message+'</p><a class="alert_close_icon mksicon-Close"></a></div>')
              $('.mkspanel').append(message_box);
              $(".global_messages").hide();
              $(".global_messages").slideDown("medium", function () {
                  setTimeout('$(".global_messages").remove()', 4000);
              });
              $(".global_messages .alert_close_icon").click(function () {
                  $(".global_messages").fadeOut("fast", function () {
                      $(this).remove();
                  })
            });
}
