package com.moncafe.avisclients.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moncafe.avisclients.model.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
}
