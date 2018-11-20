/*
 * Contact Listener Controller Class
 *
 * Manage collisions between RigidBodies in a box2D world
 *
 * Copyright 2018 - Alfredo & Harish
 */
'use strict';

import { physics } from "./Physics.js";

export class ContactListener {
    
    constructor( theWorld ) {        
        /*
         * Don't create or destroy any PHYSICS entities in these event handlers, store the info to
         * manage in an update later.
         *
         * The Contact object is generated by Box2D to contain the collision info
         * It also contains a method to get the two fixtures that collided
         * Use them to inspect the user data.
         *
         * its key that the user data have info identifying the dom element so you can manipulate.
         *
         */
        this.m_listener = new physics.Listener;
        
        // Set function redirects for Physics system "contact listeners"
        this.m_listener.PreSolve = this.preSolve;

        this.m_listener.BeginContact = this.beginContact;
        this.m_listener.EndContact = this.endContact;
        
        this.m_listener.PostSolve = this.postSolve;

        theWorld.SetContactListener( this.m_listener );
    }
    
    preSolve( contact, oldManifold ) {
        //
        // PreSolve
        //
        // This is called after collision detection, but before collision resolution.
        // This gives you a chance to disable the contact based on the current configuration.
        //
    }

    beginContact( contact ) {
        //
        // I must say that I got some inspiration from past projects on how to destroy stuff, because it seemed pretty lame to destroy objects on touch
        //
        let thingA = contact.GetFixtureA().GetBody().GetUserData();
        let thingB = contact.GetFixtureB().GetBody().GetUserData();

        let velocityA = contact.GetFixtureA().GetBody().GetLinearVelocity();
        let velocityB = contact.GetFixtureB().GetBody().GetLinearVelocity();

        // Get relative velocity
        let relativeVelocity = new physics.Vec2(velocityA.x - velocityB.x, velocityA.y - velocityB.y);

        if ((thingA == null) || (thingB == null)) {
            return;
        }

        // Some nasty checks
        if ( thingA.type === "Collidable" || thingB.type === "Collidable") {
            // They have healthhhh
            if ( thingA.type === "Collidable" ) {
                thingA.health -= relativeVelocity.Length();
            } else {
                thingB.health -= relativeVelocity.Length();
            }
        }

        // The bird will get destroyed if the relative velocity to whatever thing it is colliding with is greater than some arbitrary value because why not
        if ( thingA.type === "Bird" || thingB.type === "Bird") {
            // Check for magnitude
            if (relativeVelocity.Length() > 7.0) {
                if ( thingA.type === "Bird" ) {
                    thingA.hit = true;
                } else {
                    thingB.hit = true;
                }
            }
        }
    }

    endContact( contact ) {
        //
        // console.log(contact.GetFixtureA().GetBody().GetUserData());
        //
        // This is called when two fixtures cease to overlap.
        //
    }
    
    postSolve( contact, impulse ) {
        //
        // PostSolve
        //
        // The post solve event is where you can gather collision impulse results. If you don�t care about the impulses,
        // you should probably just implement the pre-solve event.
        //
        //if (contact.GetFixtureA().GetBody().GetUserData() == 'ball' || contact.GetFixtureB().GetBody().GetUserData() == 'ball') {
        //
        //    console.log(world.ball.impulse);
        //}
        let thingA = contact.GetFixtureA().GetBody().GetUserData();
        let thingB = contact.GetFixtureB().GetBody().GetUserData();

        if ((thingA == null) || (thingB == null)) {
            return;
        }
    }    
}