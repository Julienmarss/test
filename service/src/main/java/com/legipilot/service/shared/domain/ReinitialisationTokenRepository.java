package com.legipilot.service.shared.domain;

import com.legipilot.service.shared.domain.model.ReinitialisationToken;

public interface ReinitialisationTokenRepository {

    ReinitialisationToken generateToken(String email);

    void validateToken(ReinitialisationToken token, String email);

    void deleteToken(String email);

}
