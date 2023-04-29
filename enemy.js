window.addEventListener("load", (event) => { 
	var plyr = {el: document.getElementById("player"), hp_el: document.getElementById("player_hp"),
				base_x: "500px"};
	var enmy = {el: document.getElementById("enemy"), x: "700px", y: "300px", step: -1, base_x: "700px",
				atk_trigger: false};
	[enmy.el.style.left, enmy.el.style.top] = [enmy.x, enmy.y];


	var enemy_attack_loop = setInterval(function() {
		if (enmy.el.style.left != enmy.base_x)
			return;

		var enemy_attack = setInterval(function () {
			let x = parseInt(enmy.x.replace("px",''));
			x += enmy.step;
			enmy.x = enmy.el.style.left = x.toString() + "px";
			let collided = isCollided(attacker=enmy, defender=plyr);
			plyr.hp_el.value = (collided ? plyr.hp_el.value-0.1 : plyr.hp_el.value);
			if (enmy.el.style.left == enmy.base_x) {
				if (enmy.step == 1) {
					clearInterval(enemy_attack);
					enmy.step = -1;
				}
				else
					enmy.step = 1;
			}
			else if (enmy.el.style.left == plyr.base_x || collided)
				enmy.step = 1;
			// if plyr is hit
			if (collided) {
				let hit_anim = document.getElementById("enemy_hit_anim");
				[hit_anim.src, hit_anim.style.visibility] = ["img/slash_left.gif", "visible"];
				plyr.el.style.filter = "brightness(500%)";
				enmy.el.src = "img/enmy_atk.png";
				let plyrHitFlash = setTimeout(function () {
					plyr.el.style.filter = "brightness(100%)";
					hit_anim.style.visibility = "hidden";
					enmy.el.src = "img/enmy.gif";
					clearTimeout(plyrHitFlash);
				}, 400);
			}
		}, 5);
	}, 3000);

	setInterval(function enmyHitAnimPos() {
		let hit_anim = document.getElementById("enemy_hit_anim");
		hit_anim.style.left = plyr.el.style.left;
		hit_anim.style.top = (parseInt(plyr.el.style.top.replace("px",''))-20).toString()+"px";
	}, 1);

	function isCollided(attacker, defender) {
	  const atk = attacker.el.getBoundingClientRect();
	  const def = defender.el.getBoundingClientRect();
	  // Check for overlap using the rectangles of the elements
	  return !(
	    atk.right < def.left ||
	    atk.left > def.right - 48 ||
	    atk.bottom < def.top ||
	    atk.top > def.bottom
	  );
	}
});