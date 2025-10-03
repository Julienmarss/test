package com.legipilot.service.core.administrator.infra.out;

import com.legipilot.service.core.administrator.domain.InvitationRepository;
import com.legipilot.service.core.administrator.domain.model.Invitation;
import com.legipilot.service.core.administrator.domain.model.InvitationStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class DatabaseInvitationRepository implements InvitationRepository {

    private final JpaInvitationRepository jpaRepository;

    @Override
    @Transactional
    public Invitation save(Invitation invitation) {
        return jpaRepository.save(InvitationDto.from(invitation)).toDomain();
    }

    @Override
    @Transactional
    public Optional<Invitation> findById(UUID id) {
        return jpaRepository.findById(id).map(InvitationDto::toDomain);
    }

    @Override
    @Transactional
    public Optional<Invitation> findByToken(UUID token) {
        return jpaRepository.findByToken(token).map(InvitationDto::toDomain);
    }

    @Override
    @Transactional
    public Optional<Invitation> findByEmailAndCompanyId(String email, UUID companyId) {
        return jpaRepository.findByEmailAndCompanyId(email, companyId)
                .map(InvitationDto::toDomain);
    }

    @Override
    @Transactional
    public List<Invitation> findByCompanyId(UUID companyId) {
        return jpaRepository.findByCompanyId(companyId)
                .stream()
                .map(InvitationDto::toDomain)
                .toList();
    }

    @Override
    @Transactional
    public List<Invitation> findPendingByCompanyId(UUID companyId) {
        return jpaRepository.findByCompanyIdAndStatus(companyId, InvitationStatus.PENDING.name())
                .stream()
                .map(InvitationDto::toDomain)
                .toList();
    }

    @Override
    public void delete(UUID id) {
        jpaRepository.deleteById(id);
    }
}