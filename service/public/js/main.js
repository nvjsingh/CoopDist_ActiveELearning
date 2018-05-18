$(document).ready(function(){
    setTimeout(function () {
        $.ajax({
            type: 'GET',
            url: '/timedlogout',
            success: function(result){
                window.location.href = 'http://localhost:3773/';
            },
            error: function(err){
                console.log(err);
            }
        });
    }, 5*60*1000);

    $('.delete-user').on('click', function(){
        var uuid = $(this).data('id');
        var url = '/delete/'+uuid;
        if(confirm('Delete User?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('Deleting user...');
                    window.location.href='/admin';
                },
                error: function(err){
                    console.log(err);
                }
            });
        }
    });

    $("#gTopicSubmit").click(function(e){
        e.preventDefault();
        var gname = document.getElementById("grpname").value;
        if (gname === "") {
            alert("Please provide a group name");
            return false;
        }
        $("#selectTopicModal").modal("toggle");
        $.ajax({
            type: "POST",
            url: '/selecttopic',
            data: $('#formselecttopic').serializeArray(),
            success: function (response) {
                $('#selectMemberModal').parent().html(response);
                $("#selectMemberModal").modal("show");
            }
        });
    })

    $('.groupButton').on('click', function(e){
        var gid = $(this).attr('id');
        $.ajax({
            type: 'POST',
            url: '/enterchat',
            data: {
                g_id: gid
            },
            success: function(result){
                window.location.href='/chatPage';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});